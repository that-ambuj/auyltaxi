import { IsLatitude, IsLongitude } from "class-validator";

export class UpdateLocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;
}
