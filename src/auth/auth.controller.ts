import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/user.entity';
import { RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: RegisterDto): Promise<UserEntity> {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    const { email, password } = credentials;
    return this.authService.login(email, password);
  }
}
