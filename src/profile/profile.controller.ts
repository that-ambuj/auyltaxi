import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Session,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import * as secureSession from '@fastify/secure-session';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Session() session: secureSession.Session) {
    const user_id = session.get('data');

    console.log(user_id);

    if (!user_id) {
      throw new HttpException('User Not Logged In.', HttpStatus.FORBIDDEN);
    }

    const user = await this.profileService.findById(user_id);

    return { data: user };
  }

  @Put()
  async updateProfile(
    @Session() session: secureSession.Session,
    @Body() profileInfo: ProfileUpdateDto,
  ) {
    const user_id = session.get('data');

    if (!user_id) {
      throw new HttpException('User Not Logged In.', HttpStatus.FORBIDDEN);
    }

    const updated_user = await this.profileService.update(user_id, profileInfo);

    return {
      message: 'Profile Updated!',
      data: updated_user,
    };
  }
}
