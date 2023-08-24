import { Module } from "@nestjs/common";
import { DriverService } from "./driver.service";
import { PrismaService } from "@shared/prisma.service";
import { DriverController } from "./driver.controller";

@Module({
  controllers: [DriverController],
  providers: [DriverService, PrismaService],
})
export class DriverModule {}
