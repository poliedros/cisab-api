import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { UnitsService } from '../units/units.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const findOneUnitMockFn = jest.fn();
  const findOneCategoryMockFn = jest.fn();
  const findOneProductMockFn = jest.fn();
  const createMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  const findProductMockFn = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    startTransactionMockFn.mockReturnValue(
      Promise.resolve({
        abortTransaction: jest.fn(),
        commitTransaction: jest.fn(),
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findOne: findOneProductMockFn,
            create: createMockFn,
            startTransaction: startTransactionMockFn,
            find: findProductMockFn,
          },
        },
        { provide: UnitsService, useValue: { findOne: findOneUnitMockFn } },
        {
          provide: CategoriesService,
          useValue: { findOne: findOneCategoryMockFn },
        },
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

    findOneUnitMockFn.mockReturnValue(Promise.resolve());

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

    findOneUnitMockFn.mockReturnValue(Promise.resolve());

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

    findOneUnitMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
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

    findOneUnitMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
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

    findOneUnitMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw a bad request if category doesnt exist', async () => {
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

    findOneCategoryMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw a bad request if accessory id doesnt exist', async () => {
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

    findOneProductMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should filter products with categories', async () => {
    const products = [
      {
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
      },
    ];

    findProductMockFn.mockReturnValue(Promise.resolve(products));

    const response = await service.findAll({ categories: ['abc'] });

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });

  it('should return products without filter', async () => {
    const products = [
      {
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
      },
    ];

    findProductMockFn.mockReturnValue(Promise.resolve(products));

    const response = await service.findAll();

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });
});
