import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './actuality/news.module';
import { MatchModule } from './matchs/matchs.module';
import { MatchEntity } from './matchs/matchs.entity';
import { NewsEntity } from './actuality/actuality.entity';

@Module({
imports: [
TypeOrmModule.forRoot({
type: 'sqlite',
database: 'database.sqlite',
entities: [UserEntity, MatchEntity, NewsEntity],
synchronize: true
}),
UserModule,
AuthModule,
MatchModule,
NewsModule,
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}