import { Controller, Get, Post, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity, UserRole } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getUsers(): Promise<UserEntity[]> {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw new BadRequestException('Could not fetch users');
        }
    }

    @Get(':id_user')
    async getUser(@Param('id_user') id_user: string): Promise<UserEntity> {
        try {
            const user = await this.userService.getUser(id_user);
            if (!user) {
                throw new NotFoundException(`User with id ${id_user} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException('Could not fetch user');
        }
    }

    @Post('/addUser')
    async addUser(@Body() body: any): Promise<UserEntity> {
        const { first_name, last_name, email, password, role } = body;

        // Vérification des champs nécessaires
        if (!first_name || !last_name || !email || !password) {
            throw new BadRequestException('All fields are required');
        }        

        try {
            const newUser = await this.userService.addUser({
                first_name,
                last_name,
                email,
                password,
                role: null,
                registration_date : new Date(),
                is_validated: false,
            });
            return newUser;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('validateUser/:id_user')
    async validateUser(@Param('id_user') id_user: number, @Body() body: any): Promise<UserEntity> {
        const { role } = body
        if (!Object.values(UserRole).includes(role)) {
            throw new BadRequestException(`Invalid role: must be one of ${Object.values(UserRole).join(', ')}`);
        }
        try {
            const validatedUser = await this.userService.validateUser(id_user, role);
            return validatedUser;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    
}
