import { Module } from "@nestjs/common";
import { RideService } from "./rides.service";
import { RideController } from "./rides.controller";

@Module({
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
