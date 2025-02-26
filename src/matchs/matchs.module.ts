import { Module } from '@nestjs/common';
import { MatchService } from './matchs.service';
import { MatchController } from './matchs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './matchs.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity, UserEntity])],
  providers: [MatchService, JwtService],
  controllers: [MatchController],
  exports: [MatchService, JwtService],
})
export class MatchModule {}
