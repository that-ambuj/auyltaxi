import {
  IsLatitude,
  IsLongitude,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateRideDto {
  /**
   * Latitude of the pickup location
   *
   * @example 28.48841115843354
   */
  @IsLatitude()
  pickup_lat: number;
  /**
   * Longitude of the pickup location
   *
   * @example 77.02475824162325
   */
  @IsLongitude()
  pickup_long: number;
  /**
   * Arbitrary name of the pickup location
   */
  @IsOptional()
  pickup_name?: string;

  /**
   * Latitude of the drop location
   *
   * @example 28.315757762844907
   */
  @IsLatitude()
  drop_lat: number;
  /**
   * Longitude of the drop location
   *
   * @example 76.91433199252573
   */
  @IsLongitude()
  drop_long: number;
  /**
   * Arbitrary name of the drop location
   */
  @IsOptional()
  drop_name?: string;

  /**
   * Extra comment regarding the ride request
   *
   * @example "Need a wheelchair"
   */
  @IsOptional()
  comment?: string;

  /**
   * The fair the customer wants to pay
   *
   * @example 150
   */
  @IsNumberString()
  requested_fare: number;
}
