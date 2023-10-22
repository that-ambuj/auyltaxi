import { IsNotEmpty } from "class-validator";

export class FirabaseTokenDto {
  /**
   * @example Device Registration Token
   */
  @IsNotEmpty()
  registration_token: string;
}
