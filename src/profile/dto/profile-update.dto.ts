import { IsAlpha, IsOptional } from 'class-validator';

export class ProfileUpdateDto {
  @IsAlpha()
  @IsOptional()
  name?: string;
}
