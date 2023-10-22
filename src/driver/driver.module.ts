import { Module } from "@nestjs/common";
import { DriverService } from "./driver.service";
import { PrismaService } from "@shared/prisma.service";
import { DriverController } from "./driver.controller";
import { FirebaseService } from "@app/firebase/firebase.service";

@Module({
  controllers: [DriverController],
  providers: [DriverService, PrismaService, FirebaseService],
})
export class DriverModule {}
