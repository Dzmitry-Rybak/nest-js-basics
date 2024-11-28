import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a singup request', async () => {
        const email = 'qesdf2d3@qdsa.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: email, password: 'sadasd' })
            .expect(201)
            .then((res) => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            });
    });

    it('signup as a new user then get the currently loggedIn user', async () => {
        const email = '13132@esad.co';
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'asd' })
            .expect(201);

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie) // sets the cookie header on the outgoing request
            .expect(200);

        expect(body.email).toEqual(email);
    });
});
