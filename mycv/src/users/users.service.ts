import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable() // why i can delete it
export class UsersService {
    // repo: Repository<UserEntity>

    // constructor(repo: Repository<UserEntity>){
    //     this.repo = repo
    // }

    constructor(
        @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    ) {} // we use @InjectRepository caus the dependency injection system doesn`t play nicely with generics ex. <UserEntity>

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    async findOne(id: number) {
        if (!id) {
            //throw new NotFoundException('invalid id')
            return null;
        }

        const user = await this.repo.findOneBy({ id });
        return user;
    }

    async find(email: string) {
        return await this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<UserEntity>) {
        // Partial - optional modif
        const user = await this.findOne(id); // fetching the entity
        // console.log(attrs)
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id); // fetching the entity
        console.log(user);
        if (!user) {
            throw new NotFoundException('user already removed');
        }
        // use remove if you want to call hooks
        return this.repo.remove(user);
    }
}
