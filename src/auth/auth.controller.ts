import { Controller, Post, Body, Req, Session, Response } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signup.dto";
import { VerificationDto } from "./dto/verification.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import type { Session as TSession } from "@fastify/secure-session";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
