import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signup.dto';
import { CustomerService } from '@app/customer/customer.service';
import { VerificationDto } from './dto/verification.dto';
import { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private customerService: CustomerService,
  ) {}

  @Post('sendOtp')
  async sendOtp(@Body() userInfo: SignInDto) {
    if (userInfo.user_type === 'customer') {
      const user =
        (await this.customerService.findOneByNumber(userInfo.phone_number)) ??
        (await this.customerService.createUser(userInfo.phone_number));

      await this.customerService.sendOtp(user.id);

      return { message: 'OTP sent successfully!' };
    }
    // TODO: Driver auth
  }

  @Post('verifyOtp')
  async verifyOtp(
    @Req() req: FastifyRequest,
    @Body() verificationInfo: VerificationDto,
  ) {
    const user = await this.customerService.findUserByOtp(verificationInfo.otp);
    req.session.set('session', user.id);

    return { message: 'OTP verified!' };
  }
}
