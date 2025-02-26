import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('match')
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  opponent: string;

  @Column({ nullable: true  })
  score: string;

  @ManyToMany(() => UserEntity, (user) => user)
  @JoinTable()
  participants: UserEntity[];
}
