import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// ConfigModule - wich of .env file we r going to use
// ConfigService - expose the info inside .env files to the rest of app
import { ConfigModule, ConfigService } from '@nestjs/config'; // import for choosing different .env files
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { UserEntity } from './users/user.entity';
import { ReportsEntity } from './reports/reports.entity';
const cookieSession = require('cookie-session');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // we don't have to reimport the ConfigModule, cause it will be globaly, whenever we need config information
            envFilePath: `.env.${process.env.NODE_ENV}`, // in development NODE_ENV = 'development', in test NODE_ENV = 'test'
        }),

        // TypeOrmModule.forRoot(), - for migration TypeOrm (dosn't work :-(
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'sqlite',
                    database: config.get<string>('DB_NAME'),
                    synchronize: true,
                    entities: [UserEntity, ReportsEntity],
                };
            },
        }),

        // comment cause we need to use .env and configModule
        // TypeOrmModule.forRoot({
        //     type: 'sqlite',
        //     database: 'db.sqlite',
        //     entities: [UserEntity, ReportsEntity],
        //     synchronize: true, // false in production!!
        // }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // whenever we create an instance of AppModule, automatically take uaseValue and apply it to every incoming request
        {
            provide: APP_PIPE, // Every single request that comes into the application
            useValue: new ValidationPipe({
                // Run it through this incance of a class
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {
    constructor(private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        // this fnc to be called automatically whenever app starts listening for incoming traffic
        consumer
            .apply(
                cookieSession({
                    keys: [this.configService.get('COOKIE_KEY')], // this string is going to be used to encrypt the information
                }),
            )
            .forRoutes('*'); // Make use cookieSession Middleware on every single incoming request
    }
}
