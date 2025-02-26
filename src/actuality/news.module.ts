import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './actuality.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity, UserEntity])],
  providers: [NewsService, JwtService],
  controllers: [NewsController],
  exports: [NewsService, JwtService],
})
export class NewsModule {}
