import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';

console.log(UserEntity);

@Entity()
export class ReportsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    approved: boolean;

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    lng: number;

    @Column()
    lat: number;

    @Column()
    mileage: number;

    // ManyToOne - changes the Reports table
    @ManyToOne(() => UserEntity, (user) => user.reports)
    user: UserEntity;
}
