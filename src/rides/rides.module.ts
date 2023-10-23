import { Module } from "@nestjs/common";
import { RideService } from "./rides.service";
import { RideController } from "./rides.controller";
import { RideOffersService } from "@app/ride-offers/ride-offers.service";
import { FirebaseService } from "@app/firebase/firebase.service";
import { ProfileService } from "@app/profile/profile.service";
import { DriverService } from "@app/driver/driver.service";
import { CustomerService } from "@app/customer/customer.service";

@Module({
  controllers: [RideController],
  providers: [
    RideService,
    RideOffersService,
    FirebaseService,
    ProfileService,
    DriverService,
    CustomerService,
  ],
})
export class RideModule {}
