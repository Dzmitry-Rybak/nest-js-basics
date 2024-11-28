import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeAuthService: Partial<AuthService>;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
        fakeAuthService = {
            // methods wich will be called by UsersController
            // mock (fake) implementation
            // signup: () => {},
            signin: (email: string, password: string) => {
                return Promise.resolve({
                    id: 1,
                    email,
                    password,
                } as UserEntity);
            },
        };
        fakeUserService = {
            findOne: (id: number) => {
                return Promise.resolve({
                    id,
                    email: 'adasd@qwe.cm',
                    password: 'dsa',
                } as UserEntity);
            },
            find: (email: string) => {
                return Promise.resolve([
                    { id: 1, email, password: 'dsa' },
                ] as UserEntity[]);
            },
            // update: (id: number, attrs: Partial<UserEntity>) => {
            //     return Promise.resolve({id, email, password})
            // },
            // remove: () => {},
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController], // if UsersController try to apply UsersService/AuthService it will redirect to fakeUsersService/fakeAuthService
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUserService,
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // while we testing controllers, we can't test decorators, can't check is it Query or Param ...
    // for the testing Decorators, we need to use E2E test

    it('find all users return a lists of users with the given email', async () => {
        const users = await controller.findAllUsers('asdsa@ads.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('asdsa@ads.com');
    });

    it('find a user with the given ID', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
    });

    it('throw an error if user not found with given ID', async () => {
        fakeUserService.findOne = () => null;
        await expect(controller.findUser('2')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('singin updates session object and returns user', async () => {
        const session = { userId: -10 };
        const user = await controller.signin(
            { email: 'fada21@gmail.com', password: 'asd' },
            session,
        );
        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });

    it('return a user', async () => {
        const user = await controller.findUser('1');
        controller.whoAmI(user);
    });
});
