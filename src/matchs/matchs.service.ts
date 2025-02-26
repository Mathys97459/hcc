import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './matchs.entity';
import { UserEntity, UserRole } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Raw } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  decodeToken(authorization: string): any {
    if (!authorization) {
      throw new UnauthorizedException('Token d\'authentification manquant');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token manquant dans l\'en-tête Authorization');
    }

    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException('Échec du décodage du token');
    }
  }

  async createMatch(matchData: Partial<MatchEntity>, authorization: string): Promise<MatchEntity> {
    const userData = await this.decodeToken(authorization);
    if (userData.role !== UserRole.COACH) {
      throw new ForbiddenException('Only coaches can create matches');
    }

    const matchDate = matchData.date; 
  
    const formattedMatchDate = new Date(matchDate).toISOString().split('T')[0];
  
    const existingMatch = await this.matchRepository.findOne({
      where: {
        date: Raw((date) => `DATE(${date}) = '${formattedMatchDate}'`),
      },
    });
  
    if (existingMatch) {
      throw new BadRequestException('A match already exists on this date');
    }
  
    const newMatch = this.matchRepository.create(matchData);
    return this.matchRepository.save(newMatch);
  }
  

  async updateMatch(
    matchId: number,
    matchData: Partial<MatchEntity>,
    authorization: string,
  ): Promise<MatchEntity> {
    const userData = this.decodeToken(authorization); 

    if (userData.role !== UserRole.COACH) {
      throw new ForbiddenException('Only coaches can update matches');
    }

    const match = await this.matchRepository.findOne({ where: { id: matchId } });
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    Object.assign(match, matchData);
    return this.matchRepository.save(match);
  }

  // Méthode pour récupérer tous les matchs
  async getAllMatches(): Promise<MatchEntity[]> {
    return this.matchRepository.find({ relations: ['participants'] });
  }

  // Méthode pour récupérer un match par son ID
  async getMatchById(matchId: number): Promise<MatchEntity> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['participants'],
    });
    if (!match) {
      throw new BadRequestException('Match not found');
    }
    return match;
  }

  async getMatchsOfPlayer(id_user: number): Promise<number[]> {
    const matches = await this.matchRepository.find({
      where: { participants: { id_user: id_user } },
      relations: ['participants'],
    });

    if (!matches.length) {
      throw new BadRequestException('No matches found for this user');
    }

    return matches.map(match => match.id);
}


  async addParticipant(matchId: number, authorization: string): Promise<MatchEntity> {
    const userData = await this.decodeToken(authorization);
  
    if (!userData) {
      throw new BadRequestException('User not found');
    }
  
    if (userData.role !== UserRole.JOUEUR) {
      throw new ForbiddenException('Only players can join a match');
    }
  
    // Charger le match avec les participants existants
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['participants'],
    });
  
    if (!match) {
      throw new BadRequestException('Match not found');
    }
  
    // Vérifier si l'utilisateur est déjà un participant
    if (match.participants.some(participant => participant.id_user === userData.id_user)) {
      throw new BadRequestException('User is already a participant in this match');
    }
    console.log(userData)
    // Charger l'entité utilisateur (si nécessaire)
    const user = await this.userRepository.findOne({ where: { id_user: userData.id } });
    console.log(user)
    if (user) {
      throw new BadRequestException('This player has already join the match.');
    }
  
    // Ajouter l'utilisateur comme participant
    match.participants.push(user);
  
    // Sauvegarder le match avec le nouveau participant
    return this.matchRepository.save(match);
  }
  

  async removeParticipant(matchId: number, userId: number): Promise<MatchEntity> {
    const user = await this.userRepository.findOne({ where: { id_user: userId } });
    console.log(user)
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['participants'],
    });

    if (!match) {
      throw new BadRequestException('Match not found');
    }

    const participantIndex = match.participants.findIndex(participant => participant.id_user === user.id_user);
    console.log(participantIndex)
    if (participantIndex === -1) {
      throw new BadRequestException(`User ${participantIndex} is not a participant in this match`);
    }

    match.participants.splice(participantIndex, 1);
    return this.matchRepository.save(match);
  }
}
