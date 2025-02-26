import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './actuality.entity';
import { UserEntity, UserRole } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Raw } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
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

  async createNews(newsData: Partial<NewsEntity>, authorization: string): Promise<NewsEntity> {
    console.log(newsData)

    const userData = await this.decodeToken(authorization);
    console.log(userData);
    if (userData.role !== UserRole.CONTRIBUTEUR) {
      throw new ForbiddenException('Only contributors can create matches');
    }

    newsData = {...newsData, date: new Date(), author: userData.id} 
    const { title, content, date, author } = newsData;

    if (!title || !content || !date || !author) {
      throw new BadRequestException('Missing data. Should have a title, content and author.');
    }
  
    const news = this.newsRepository.create(newsData);
    return this.newsRepository.save(news);
  }
  

  async getAllNews(): Promise<NewsEntity[]> {
    return this.newsRepository.find();
  }

  async getNewsById(actualiteId: number): Promise<NewsEntity> {
    const news = await this.newsRepository.findOne({
      where: { id: actualiteId },
    });
    if (!news) {
      throw new BadRequestException('News not found');
    }
    return news;
  }
}
