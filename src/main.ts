import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import secureSession from '@fastify/secure-session';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: process.env['NODE_ENV'] === 'production',
    }),
  );

  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    sessionName: 'session',
    cookieName: 'auth-session',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  });

  // app.enableShutdownHooks();
  app.enableVersioning();
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  const configService = app.get(ConfigService);
  const env = configService.get<Environment>('NODE_ENV');

  if (env === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('auyltaxi API')
      .setVersion('1.0')
      .build();

    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
