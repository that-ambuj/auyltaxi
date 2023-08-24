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
   * `created_at` value for the last item in the list
   */
  @IsDate()
  @IsOptional()
  cursor?: Date;

  /**
   * Maximum radius of rides from the driver in Kilo Meters
   *
   * @default 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  max_distance?: number = 1;
}
