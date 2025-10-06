import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'node-fetch';

jest.mock('node-fetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockedFetch = require('node-fetch').default;

describe('AppController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        mockedFetch.mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: async () => ({
                    centroid: { lat: 37.3825, lng: -96.1248 },
                    bounds: {
                        north: 40.7128,
                        south: 34.0522,
                        east: -74.0060,
                        west: -118.2437,
                    },
                }),
            } as Response)
        );
    });

    afterEach(() => {
        mockedFetch.mockReset();
    });

    it('Test API with valid points: expects 200', async () => {
        const payload = { points: [{ lat: 13.43, lng: -10.31 }, { lat: 1.2, lng: 0 }] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(200);
        expect(res.body).toBeDefined();
    });

    it('Test API with empty points list: expects 400 and too_short error.', async () => {
        const payload = { points: [] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/too few|at least/i);
    });

    it('Test API with missing points key: expects 400 and missing error.', async () => {
        const payload = {};
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/must be an array/i);
    });

    it('Test API with points as wrong type (string): expects 400 and list_type error.', async () => {
        const payload = { points: "not_a_list" };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/array/i);
    });

    it('Test API with points as list of non-dict: expects 400 and model_attributes_type error.', async () => {
        const payload = { points: [1, 2, 3] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/object/i);
    });

    it('Test API with points containing invalid types: expects 400 and float_parsing error.', async () => {
        const payload = { points: [{ lat: "a", lng: "b" }] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/number/i);
    });

    it('Test API with point missing latitude: expects 400 and missing error.', async () => {
        const payload = { points: [{ lng: 2 }] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/lat.*defined|lat.*null or undefined/i);
    });

    it('Test API with point missing longitude: expects 400 and missing error.', async () => {
        const payload = { points: [{ lat: 1 }] };
        const res = await request(app.getHttpServer())
            .post('/points')
            .send(payload)
            .expect(400);
        expect(
            Array.isArray(res.body.message) ? res.body.message.join(' ') : res.body.message
        ).toMatch(/lng.*defined|lng.*null or undefined/i);
    });
});
