import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, false);
            try {
                const url = new URL(origin);
                if (
                    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
                ) {
                    return callback(null, true);
                }
            } catch (e) { }
            callback(null, false);
        },
        methods: ['POST'],
    });
    await app.listen(5000);
}
bootstrap();
