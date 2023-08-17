import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

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
