import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // comment this code beacause we use E2E test, and E2E test starts from App.module file, not using main.ts file.
    // So we need to apply this as global middleware.
    // We make sure that it gets aplied to every single request that comes into application

    // app.use(
    //     cookieSession({
    //         keys: ['somestr'], // this string is going to be used to encrypt the information
    //     }),
    // );

    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //     }),
    // );
    await app.listen(3000);
}
bootstrap();
