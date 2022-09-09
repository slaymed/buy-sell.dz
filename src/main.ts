import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { TransformInterceptor } from './base/interceptors';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm/out';
import { DataSource } from 'typeorm';
import { SessionStore } from './typeorm/entities';
import { ConfigService } from '@nestjs/config';
import { ExceptionFactory } from './class-validator';
import { ValidationError } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);
  const sessionStoreRepository = dataSource.getRepository(SessionStore);

  app.enableCors({
    origin: (_, callback) => callback(null, true),
    credentials: true,
  });

  app.use(cookieParser());

  app.use(
    session({
      secret: configService.get<string>('SESSIONS_SECRET_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 20 * 1000 },
      store: new TypeormStore({
        cleanupLimit: 10,
        ttl: 20,
      }).connect(sessionStoreRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: Array<ValidationError>) =>
        new BadRequestException(new ExceptionFactory().map(errors)),
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder().setTitle('Slay Api').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(8991);
}

bootstrap();
