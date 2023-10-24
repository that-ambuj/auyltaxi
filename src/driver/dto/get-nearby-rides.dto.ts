import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional } from "class-validator";

export class GetNearbyRidesDto {
  /**
   * @default 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  /**
   * @default 10
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  /**
   * Maximum radius of rides from the driver in Kilo Meters
   *
   * @todo unused for now, will be implemented later
   * @default 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  max_distance?: number = 1;
}
