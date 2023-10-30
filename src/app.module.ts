import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@config";
import { HealthModule } from "./health/health.module";
import { fastifyMiddie } from "@fastify/middie";
import { CustomerModule } from "./customer/customer.module";
import { AuthModule } from "./auth/auth.module";
import { DriverModule } from "./driver/driver.module";
import { PrismaModule } from "@shared/prisma.module";
import { PrismaService } from "@shared/prisma.service";
import { ProfileModule } from "./profile/profile.module";
import { OtpService } from "./otp.service";
import { RideModule } from "./rides/rides.module";
import { RideOffersModule } from "./ride-offers/ride-offers.module";
import { CronService } from "./cron.service";
import { ScheduleModule } from "@nestjs/schedule";
import { FirebaseService } from "./firebase/firebase.service";

@Module({
  imports: [
    ConfigModule.forRoot({ validate, expandVariables: true }),
    ScheduleModule.forRoot(),
    HealthModule,
    AuthModule,
    CustomerModule,
    DriverModule,
    PrismaModule,
    ProfileModule,
    RideModule,
    RideOffersModule,
  ],
  controllers: [AppController],
  exports: [PrismaService, PrismaModule, FirebaseService],
  providers: [
    PrismaService,
    AppService,
    OtpService,
    CronService,
    FirebaseService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(fastifyMiddie);
  }
}
