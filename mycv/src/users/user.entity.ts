import { ReportsEntity } from '../reports/reports.entity';
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
//import { Exclude } from "class-transformer"; // take an instance of a UserEntity and turn it into a plain object

console.log(ReportsEntity);

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    //@Exclude()// road to no include password, but do this in the other way
    password: string;

    @Column({ default: true })
    admin: boolean;

    // OnetoMany - doesn't change the User table
    // 1 argument - user is going to be assosiated with ReportsEntity type
    @OneToMany(() => ReportsEntity, (report) => report.user) // just memprized this arguments
    reports: ReportsEntity[];

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id:', this.id);
    }
    @AfterUpdate()
    logUpdate() {
        console.log('Updated user with id:', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed user with id:', this.id);
    }
}
