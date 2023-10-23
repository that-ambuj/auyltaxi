import { Module } from "@nestjs/common";
import { DriverService } from "./driver.service";
import { PrismaService } from "@shared/prisma.service";
import { DriverController } from "./driver.controller";
import { FirebaseService } from "@app/firebase/firebase.service";
import { ProfileService } from "@app/profile/profile.service";
import { CustomerService } from "@app/customer/customer.service";

@Module({
  controllers: [DriverController],
  providers: [
    DriverService,
    PrismaService,
    FirebaseService,
    ProfileService,
    CustomerService,
    DriverService,
  ],
})
export class DriverModule {}
