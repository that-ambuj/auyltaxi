import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config';
import { HealthModule } from './health/health.module';
import { PrismaService } from './shared/prisma.service';
import { fastifyMiddie } from '@fastify/middie';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, expandVariables: true }),
    HealthModule,
    AuthModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(fastifyMiddie);
  }
}
