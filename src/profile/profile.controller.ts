import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Session,
  Put,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileUpdateDto } from "./dto/profile-update.dto";
import * as secureSession from "@fastify/secure-session";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("profile")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Session() session: secureSession.Session) {
    const user_id = session.get("data");

    if (!user_id) {
      throw new HttpException("User Not Logged In.", HttpStatus.FORBIDDEN);
    }

    return this.profileService.findById(user_id);
  }

  @Put()
  async updateProfile(
    @Session() session: secureSession.Session,
    @Body() profileInfo: ProfileUpdateDto,
  ) {
    const user_id = session.get("data");

    if (!user_id) {
      throw new HttpException("User Not Logged In.", HttpStatus.FORBIDDEN);
    }

    const updated_user = await this.profileService.update(user_id, profileInfo);
    if (!updated_user) {
      throw new HttpException("User Not Logged In.", HttpStatus.FORBIDDEN);
    }

    return {
      message: "Profile Updated!",
      data: updated_user,
    };
  }
}
