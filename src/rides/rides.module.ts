import { Module } from "@nestjs/common";
import { RideService } from "./rides.service";
import { RideController } from "./rides.controller";
import { RideOffersService } from "@app/ride-offers/ride-offers.service";

@Module({
  controllers: [RideController],
  providers: [RideService, RideOffersService],
})
export class RideModule {}
