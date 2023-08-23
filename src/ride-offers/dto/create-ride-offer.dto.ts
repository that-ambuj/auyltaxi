import { IsNumber, IsUUID } from "class-validator";

export class CreateRideOfferDto {
  @IsUUID(4)
  ride_id: string;

  @IsNumber()
  proposed_fare: number;
}
