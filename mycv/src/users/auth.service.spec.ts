import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    // describe - just apply a further description to the text inside of here
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fakecopy of the users service
        const users: UserEntity[] = [];
        fakeUsersService = {
            //find: () => Promise.resolve([]), // creates a promise and then immediately resolves it with the given value | OLD VERSION
            find: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email,
                );
                return Promise.resolve(filteredUsers); // return Promise, cause find - async function
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 9999),
                    email,
                    password,
                } as UserEntity;
                users.push(user);
                return Promise.resolve(user);
            },
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService, // if anyone asks for a copy of the UsersService
                    useValue: fakeUsersService, // then give them the value of fakeUsersService
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asd@sad.com', 'asd');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        // BEFORE CHANGING FIND METHOD
        // fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as UserEntity]); // always send this user as response, it's dosn't matter what email data in service.signup('asdf@asdf.com', 'asdf')
        // await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException); // we get user: { id: 1, email: 'a', password: '1' }, doesn't matter that we try to find about asdf@asdf.com email user, always get positive result with { id: 1, email: 'a', password: '1' } user

        // AFTER
        await service.signup('fakeemail@sa.com', 'fakepass');
        await expect(
            service.signup('fakeemail@sa.com', 'fakepass'),
        ).rejects.toThrow(BadRequestException);
    });

    it('throw if signin is called with an unused email', async () => {
        //fakeUsersService.find = () => Promise.resolve([{id: 1, email: '123@ads.com', password: '132'} as UserEntity]) - without this line cause we take out empty fake array from 14 line
        await expect(service.signin('asdf@asdasd.com', 'dsa')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('throws if an invalid password is provided', async () => {
        // BEFORE CHANGING FIND METHOD
        // fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'das@ads.asd', password: '12e3.asd'} as UserEntity]); // in our fake base we have this password 12e3.asd
        // await expect(service.signin('das@ads.asd', '12e3.asd')).rejects.toThrow(BadRequestException); // but then in singin() our password '12e3.asd' will be hashed and changed to smthing like '123dsa12esda12', and then password from DB  12e3.asd !== '123dsa12esda12' -> BadRequestException

        await service.signup('das@ads.asd', 'fakepass');
        await expect(service.signin('das@ads.asd', '12e3.asd')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('returns a user if correct password is provided', async () => {
        // fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'das@ads.asd', password: '25789ece69336c51.3051902bac8778f1ff949835732c044de07b7ad627e9f686ef87e2a0c1b2178f'} as UserEntity]);

        await service.signup('asd@asd.casd', 'comepassword');
        const user = await service.signin('asd@asd.casd', 'comepassword');
        expect(user).toBeDefined();
    });
});
