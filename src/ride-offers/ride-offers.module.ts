import { Module } from "@nestjs/common";
import { RideOffersService } from "./ride-offers.service";
import { RideOffersController } from "./ride-offers.controller";

@Module({
  controllers: [RideOffersController],
  providers: [RideOffersService],
})
export class RideOffersModule {}
