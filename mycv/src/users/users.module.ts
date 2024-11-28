import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])], // this step will create repository for us
    controllers: [UsersController],
    providers: [
        // using Dependency Injection: we mark class as Injectable -> add the class to the list of providers
        UsersService,
        AuthService,

        // Comment this, because we use Middleware insted of interceptor (to get user before Guard)
        // {
        //     // What is how we set up a globally scoped interceptor
        //     provide: APP_INTERCEPTOR,
        //     useClass: CurrentUserInterceptor,
        // },
    ],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}
