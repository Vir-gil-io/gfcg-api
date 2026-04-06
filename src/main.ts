import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Uso de Pipes de forma global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Elimina las propiedades que no están definidas en el DTO
    }),
  );

  //Uso de filtreos globales
  app.useGlobalFilters(new AllExceptionFilter());

  //Configuracion de SWAGGER
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentación de la API para pruebas')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  //localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
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
