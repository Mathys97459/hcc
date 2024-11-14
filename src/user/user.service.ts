import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getAllUsers(): Promise<UserEntity[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new BadRequestException('Could not fetch users');
        }
    }

    async getUser(id_user: string): Promise<UserEntity | null> {
        const id = parseInt(id_user, 10);
        try {
            return await this.userRepository.findOne({ where: { id_user: id } });
        } catch (error) {
            throw new BadRequestException('Could not fetch user');
        }
    }

    async addUser(userData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        role: UserRole;
        registration_date: Date;
        is_validated: boolean;
    }): Promise<UserEntity> {
        const { email, role } = userData;

        // Vérification si l'email est déjà utilisé
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }

        // Créer et enregistrer le nouvel utilisateur
        try {
            const newUser = this.userRepository.create(userData);
            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new BadRequestException(`Could not add user : ${error.message}`);
        }
    }

    async validateUser(id_user: number, role: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne({ where: { id_user } });
            
            if (!user) {
                throw new BadRequestException('User not found');
            }
    
            if (!Object.values(UserRole).includes(role as UserRole)) {
                throw new BadRequestException(`Invalid role: must be one of ${Object.values(UserRole).join(', ')}`);
            }
    
            user.is_validated = true;
            user.role = role as UserRole;
    
            // Sauvegarde de l'utilisateur modifié
            return await this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException('Could not validate user');
        }
    }
    
}
