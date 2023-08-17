import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config';
import { HealthModule } from './health/health.module';
import { PrismaService } from './shared/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, expandVariables: true }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
