import { Test, TestingModule } from '@nestjs/testing';
import { RideOffersController } from './ride-offers.controller';
import { RideOffersService } from './ride-offers.service';

describe('RideOffersController', () => {
  let controller: RideOffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideOffersController],
      providers: [RideOffersService],
    }).compile();

    controller = module.get<RideOffersController>(RideOffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
