import { IsEnum, IsInt, IsOptional } from "class-validator";
import { RideStatus } from "./ride-status.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetRidesDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ enum: RideStatus, isArray: true, required: false })
  @IsOptional()
  @IsEnum(RideStatus, { each: true })
  status?: RideStatus[];
}
