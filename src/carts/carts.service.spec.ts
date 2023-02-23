import { Test, TestingModule } from '@nestjs/testing';
import { CountiesService } from '../counties/counties.service';
import { DemandsService } from '../demands/demands.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CartsCacheRepository } from './carts.cache.repository';
import { CartsMongoRepository } from './carts.mongo.repository';
import { CartsService } from './carts.service';

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: CartsCacheRepository,
          useValue: {},
        },
        {
          provide: CartsMongoRepository,
          useValue: {},
        },
        {
          provide: ProductsService,
          useValue: {},
        },
        {
          provide: DemandsService,
          useValue: {},
        },
        {
          provide: CountiesService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
