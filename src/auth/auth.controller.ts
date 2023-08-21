import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signup.dto';
import { VerificationDto } from './dto/verification.dto';
import { FastifyRequest } from 'fastify';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sendOtp')
  @ApiCreatedResponse({ description: 'An OTP is sent.' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async sendOtp(@Body() userInfo: SignInDto) {
    const otp = this.authService.signInWithOtp(userInfo);

    return { message: 'OTP sent successfully!', otp };
  }

  @Post('verifyOtp')
  async verifyOtp(
    @Req() req: FastifyRequest,
    @Body() verificationInfo: VerificationDto,
  ) {
    const user = await this.authService.verifyOtp(verificationInfo.otp);

    req.session.set('session', user.id);

    return { message: 'OTP verified!' };
  }
}
