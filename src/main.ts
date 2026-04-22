import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  //Uso de Pipes de forma global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Elimina las propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, //Lanza un error si se envían propiedades no definidas en el DTO
    }),
  );

  //Configuracion de SWAGGER
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentación de la API para pruebas')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`API corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();

//?MySQL
//! npm i mysql2
//! npm i @types/mysql -D

//?POSTGRES
//! npm i pg
//! npm i @types/pg -D

//? SWAGGER
//! npm i @nestjs/swagger

//? BCRYPT
//!npm i bcrypt
//!npm i -D @types/bcrypt
