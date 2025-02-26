import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.id_user, { nullable: false })
  author: UserEntity;
}
