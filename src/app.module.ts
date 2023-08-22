import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config';
import { HealthModule } from './health/health.module';
import { fastifyMiddie } from '@fastify/middie';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';
import { PrismaModule } from '@shared/prisma.module';
import { PrismaService } from '@shared/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { OtpService } from './otp.service';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, expandVariables: true }),
    HealthModule,
    AuthModule,
    CustomerModule,
    DriverModule,
    PrismaModule,
    ProfileModule,
    RideModule,
  ],
  controllers: [AppController],
  exports: [PrismaService, PrismaModule],
  providers: [PrismaService, AppService, OtpService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(fastifyMiddie);
  }
}
