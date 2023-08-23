import { OmitType } from "@nestjs/swagger";
import { CreateRideOfferDto } from "./create-ride-offer.dto";

export class UpdateRideOfferDto extends OmitType(CreateRideOfferDto, [
  "ride_id",
] as const) {}
