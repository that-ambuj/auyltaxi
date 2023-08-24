import { PickType } from "@nestjs/swagger";
import { CreateRideDto } from "./create-ride.dto";

export class UpdateRideDto extends PickType(CreateRideDto, [
  "comment",
  "requested_fare",
]) {}
