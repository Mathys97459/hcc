import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
@Module({
imports: [
TypeOrmModule.forRoot({
type: 'sqlite',
database: 'database.sqlite',
entities: [UserEntity],
synchronize: true
}),
UserModule,
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}