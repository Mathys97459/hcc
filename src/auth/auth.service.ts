import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<UserEntity> {
    return this.userService.addUser({
      ...userData,
      role: null,
      registration_date: new Date(),
      is_validated: false,
    });
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id_user, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET });
    return { token };
  }
}
