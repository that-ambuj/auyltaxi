import { Body, Controller, Put, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { FastifyRequest } from 'fastify';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
