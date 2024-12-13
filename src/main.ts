import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Iconic API')
    .setDescription('The Iconic API description')
    .setVersion('1.0')
    .addTag('iconic')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
