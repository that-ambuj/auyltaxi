import { IsAlpha, IsAlphanumeric, IsOptional } from 'class-validator';

export class ProfileUpdateDto {
  @IsAlpha()
  @IsOptional()
  name?: string;

  /**
   * Car's license plate number
   *
   * Noop in case of customer
   */
  @IsAlphanumeric()
  @IsOptional()
  car_number?: string;

  /**
   * Car's Model Name
   *
   * Noop in case of customer
   *
   * @example "911 Turbo S"
   */
  @IsOptional()
  car_model?: string;

  /**
   * Car's Color
   *
   * Noop in case of customer
   *
   * @example Porsche
   */
  @IsOptional()
  car_brand?: string;
}
