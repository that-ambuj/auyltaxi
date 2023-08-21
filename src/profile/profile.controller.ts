import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { FastifyRequest } from 'fastify';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: FastifyRequest) {
    const user_id = req.session.get('session');

    const user = this.profileService.findById(user_id);

    return { data: user };
  }

  @Put()
  async updateProfile(
    @Req() req: FastifyRequest,
    @Body() profileInfo: ProfileUpdateDto,
  ) {
    const user_id = req.session.get('session');

    const updated_user = this.profileService.update(user_id, profileInfo);

    return {
      message: 'Profile Updated!',
      data: updated_user,
    };
  }
}
