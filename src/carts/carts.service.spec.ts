import { Test, TestingModule } from '@nestjs/testing';
import { CountiesService } from '../counties/counties.service';
import { DemandsService } from '../demands/demands.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CartsCacheRepository } from './carts.cache.repository';
import { CartsMongoRepository } from './carts.mongo.repository';
import { CartsService } from './carts.service';
import { CartBuilder } from './builders/cart.builder';
import { BadRequestException } from '@nestjs/common';

describe('CartsService', () => {
  let service: CartsService;
  const cartBuilder = new CartBuilder();
  const findOneOrReturnUndefinedMockFn = jest.fn();
  const productFindAllMockFn = jest.fn();
  const demandsFindOneMockFn = jest.fn();
  const countiesFindOneMockFn = jest.fn();
  const usersFindOneMockFn = jest.fn();
  const cacheUpsertMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: CartsCacheRepository,
          useValue: {
            upsert: cacheUpsertMockFn,
          },
        },
        {
          provide: CartsMongoRepository,
          useValue: {
            findOneOrReturnUndefined: findOneOrReturnUndefinedMockFn,
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findAll: productFindAllMockFn,
          },
        },
        {
          provide: DemandsService,
          useValue: {
            findOne: demandsFindOneMockFn,
          },
        },
        {
          provide: CountiesService,
          useValue: {
            findOne: countiesFindOneMockFn,
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: usersFindOneMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartBuilder.reset();
  });

  it('should throw bad request if cart already exists', async () => {
    try {
      const cart = cartBuilder
        .addDemandId('2')
        .addProduct({
          product_id: '12',
          quantity: 3,
        })
        .build();

      findOneOrReturnUndefinedMockFn.mockReturnValue(Promise.resolve({}));
      await service.upsert(cart, '1a', '2a');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should upsert cart', async () => {
    const cart = cartBuilder
      .addDemandId('2')
      .addProduct({
        product_id: '12',
        quantity: 3,
      })
      .build();

    const product = {
      _id: '12',
      name: 'Product Test',
      norms: [],
      categories: [],
      photo_url: '',
      measurements: [],
    };

    findOneOrReturnUndefinedMockFn.mockReturnValue(Promise.resolve(undefined));
    productFindAllMockFn.mockReturnValue(Promise.resolve([product]));
    demandsFindOneMockFn.mockReturnValue(
      Promise.resolve({ name: 'Demand name' }),
    );
    usersFindOneMockFn.mockReturnValue(
      Promise.resolve({ name: 'Name', surname: 'Surname' }),
    );
    countiesFindOneMockFn.mockReturnValue(
      Promise.resolve({ name: 'County name' }),
    );

    const res = await service.upsert(cart, '1a', '2a');

    expect(res._id).not.toBeUndefined();
    expect(res.user_id).toEqual('2a');
    expect(res.state).toEqual('opened');
    expect(res.updated_on).not.toBeUndefined();
    expect(res.product_ids).not.toBeUndefined();
    expect(res.products).not.toBeUndefined();
    expect(res.demand_name).toEqual('Demand name');
    expect(res.demand_id).toEqual('2');
    expect(res.user_name).toEqual('Name Surname');
    expect(res.county_id).toEqual('1a');
    expect(res.county_name).toEqual('County name');
  });

  it('closed carts should be gotten on get', async () => {
    const cart = cartBuilder
      .addDemandId('2')
      .addProduct({
        product_id: '12',
        quantity: 3,
      })
      .build();

    findOneOrReturnUndefinedMockFn.mockReturnValue(
      Promise.resolve({
        ...cart,
        state: 'closed',
        updated_on: new Date(),
        user_id: '3f',
        _id: 'dfe2',
      }),
    );

    const res = await service.get('1a', '2', '3f');

    expect(res._id).not.toBeUndefined();
    expect(res.products).not.toBeUndefined();
    expect(res.state).toEqual('closed');
    expect(res.updated_on).not.toBeUndefined();
    expect(res.user_id).not.toBeUndefined();
  });
});
