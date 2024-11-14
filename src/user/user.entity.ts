import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    COACH = 'coach',
    CONTRIBUTEUR = 'contributeur',
    JOUEUR = 'joueur'
}

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'varchar', nullable: true  })
    role: UserRole | null;

    @Column({ type: 'date' })
    registration_date: Date;

    @Column({ default: false })
    is_validated: boolean;
}
