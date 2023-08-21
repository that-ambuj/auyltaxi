import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { OtpService } from '@app/otp.service';
import { PrismaService } from '@shared/prisma.service';

@Module({
  providers: [DriverService, OtpService, PrismaService],
})
export class DriverModule {}
