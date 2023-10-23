import { Module } from "@nestjs/common";
import { RideOffersService } from "./ride-offers.service";
import { RideOffersController } from "./ride-offers.controller";
import { DriverService } from "@app/driver/driver.service";
import { FirebaseService } from "@app/firebase/firebase.service";
import { ProfileService } from "@app/profile/profile.service";
import { CustomerService } from "@app/customer/customer.service";

@Module({
  controllers: [RideOffersController],
  providers: [
    RideOffersService,
    DriverService,
    CustomerService,
    FirebaseService,
    ProfileService,
  ],
})
export class RideOffersModule {}
