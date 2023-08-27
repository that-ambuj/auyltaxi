import { GetRidesDto } from "@app/rides/dto/get-rides.dto";
import { OmitType } from "@nestjs/swagger";

export class GetRidesDriverDto extends OmitType(GetRidesDto, [
  "status",
] as const) {}
