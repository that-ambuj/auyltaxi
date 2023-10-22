import {
  Controller,
  Post,
  Body,
  Session,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signup.dto";
import { VerificationDto } from "./dto/verification.dto";
import type { Session as TSession } from "@fastify/secure-session";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FirabaseTokenDto } from "./dto/device_token.dto";
import { ProfileService } from "@app/profile/profile.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Post("sendOtp")
  @ApiCreatedResponse({ description: "An OTP is sent." })
  @ApiBadRequestResponse({ description: "Validation error" })
  async sendOtp(@Body() userInfo: SignInDto) {
    const otp = await this.authService.signInWithOtp(userInfo);

    return { message: "OTP sent successfully!", otp };
  }

  @Post("verifyOtp")
  async verifyOtp(
    @Session() session: TSession,
    @Body() verificationInfo: VerificationDto,
  ) {
    const user = await this.authService.verifyOtp(verificationInfo.otp);

    const is_new = !user.name;

    session.set("data", user.id);

    return { message: "OTP verified!", is_new };
  }

  @Post("deviceToken")
  async setDeviceToken(
    @Session() session: TSession,
    @Body() tokenInfo: FirabaseTokenDto,
  ) {
    const user_id = session.get("data");
    if (!user_id) throw new UnauthorizedException("User not logged in");

    const user = await this.profileService.findById(user_id);
    if (!user) throw new UnauthorizedException("User does not exist.");

    return this.authService.setDeviceToken({
      id: user.id,
      user_type: user.user_type,
      device_token: tokenInfo.registration_token,
    });
  }
}
