import {
  IsLatitude,
  IsLongitude,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateRideDto {
  /**
   * Longitude of the pickup location
   */
  @IsLongitude()
  pickup_long: string;
  /**
   * Latitude of the pickup location
   */
  @IsLatitude()
  pickup_lat: string;
  /**
   * Arbitrary name of the pickup location
   */
  @IsOptional()
  pickup_name?: string;

  /**
   * Longitude of the drop location
   */
  @IsLongitude()
  drop_long: string;
  /**
   * Latitude of the drop location
   */
  @IsLatitude()
  drop_lat: string;
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
  requested_fare: string;
}
