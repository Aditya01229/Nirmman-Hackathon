import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from 'cors'; // Import CorsOptions

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: '*', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Enable credentials if you're using cookies or authorization
  };

  app.enableCors(corsOptions); // Enable CORS with the specified options

  await app.listen(3000);
}

bootstrap();
