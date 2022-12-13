import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UnitsService } from '../units/units.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const findOneMockFn = jest.fn();
  const createMockFn = jest.fn();

  const startTransactionMockFn = jest.fn();
  startTransactionMockFn.mockReturnValue(
    Promise.resolve({
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            create: createMockFn,
            startTransaction: startTransactionMockFn,
          },
        },
        { provide: UnitsService, useValue: { findOne: findOneMockFn } },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create product', async () => {
    const request: CreateProductRequest = {
      name: 'string',
      measurements: [
        {
          name: 'width',
          value: '3',
          unit: 'cm',
        },
      ],
      accessory_ids: ['ab'],
      categories: ['ab'],
      code: 'ab',
      norms: ['ab'],
    };

    findOneMockFn.mockReturnValue(Promise.resolve());

    const productRes = {
      _id: '635aece69b8ac8a5056875a2',
      name: 'string',
      measurements: [
        {
          name: 'width',
          value: '3',
          unit: 'cm',
        },
      ],
    };

    createMockFn.mockReturnValue(Promise.resolve(productRes));

    const product = await service.create(request);

    expect(product._id).toEqual('635aece69b8ac8a5056875a2');
    expect(product.name).toEqual('string');
    expect(product.measurements.length).toEqual(1);
  });

  it('should abort if create breaks', async () => {
    const request: CreateProductRequest = {
      name: 'string',
      measurements: [
        {
          name: 'width',
          value: '3',
          unit: 'cm',
        },
      ],
      accessory_ids: ['ab'],
      categories: ['ab'],
      code: 'ab',
      norms: ['ab'],
    };

    findOneMockFn.mockReturnValue(Promise.resolve());

    createMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should throw a bad request if unit doesnt exist', async () => {
    const request: CreateProductRequest = {
      name: 'string',
      measurements: [
        {
          name: 'width',
          value: '3',
          unit: 'cm',
        },
      ],
      accessory_ids: ['ab'],
      categories: ['ab'],
      code: 'ab',
      norms: ['ab'],
    };

    findOneMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
