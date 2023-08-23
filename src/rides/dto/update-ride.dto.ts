import { PickType } from "@nestjs/mapped-types";
import { CreateRideDto } from "./create-ride.dto";

export class UpdateRideDto extends PickType(CreateRideDto, [
  "comment",
  "requested_fare",
]) {}
