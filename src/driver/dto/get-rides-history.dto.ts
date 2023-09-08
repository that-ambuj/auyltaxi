import { IsEnum, IsInt, IsOptional } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger";

export enum RideStatusForHistory {
  BOOKED = "BOOKED",
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
}

export class GetRidesHistoryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ enum: RideStatusForHistory, isArray: true, required: false })
  @IsOptional()
  @IsEnum(RideStatusForHistory, { each: true })
  status?: RideStatusForHistory[];

  skip(): number {
    return (this.page - 1) * this.limit;
  }
}