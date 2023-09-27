import { Module } from "@nestjs/common";
import { RideOffersService } from "./ride-offers.service";
import { RideOffersController } from "./ride-offers.controller";
import { DriverService } from "@app/driver/driver.service";

@Module({
  controllers: [RideOffersController],
  providers: [RideOffersService, DriverService],
})
export class RideOffersModule {}
