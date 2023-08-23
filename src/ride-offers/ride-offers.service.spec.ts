import { Test, TestingModule } from '@nestjs/testing';
import { RideOffersService } from './ride-offers.service';

describe('RideOffersService', () => {
  let service: RideOffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RideOffersService],
    }).compile();

    service = module.get<RideOffersService>(RideOffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
