import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { UnitsService } from '../units/units.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { GetProductResponse } from './dto/response/get-product-response.dto';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { NotifierService } from './../notifier/notifier.service';
import { SuggestProductRequest } from './dto/request/suggest-product-request.dto';
import { Payload } from '../auth/auth.service';
import { Role } from '../auth/role.enum';

function buildCreateProductRequest() {
  return {
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
    notes: 'notes about product',
  };
}
describe('ProductsService', () => {
  let service: ProductsService;
  const findOneUnitMockFn = jest.fn();
  const findOneCategoryMockFn = jest.fn();
  const findOneProductMockFn = jest.fn();
  const createMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  const findProductMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
  const emitMockFn = jest.fn();

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
            deleteOne: deleteOneMockFn,
          },
        },
        { provide: UnitsService, useValue: { findOne: findOneUnitMockFn } },
        {
          provide: CategoriesService,
          useValue: { findOne: findOneCategoryMockFn },
        },
        {
          provide: NotifierService,
          useValue: { emit: emitMockFn },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create product', async () => {
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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
    const request: CreateProductRequest = buildCreateProductRequest();

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

    const response = await service.findAll({
      categories: ['abc'],
      ids: undefined,
    });

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });

  it('should filter products with ids', async () => {
    const products = [buildCreateProductRequest()];

    findProductMockFn.mockReturnValue(Promise.resolve(products));

    const response = await service.findAll({
      categories: undefined,
      ids: ['1'],
    });

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });

  it('should return products without filter', async () => {
    const products = [buildCreateProductRequest()];

    findProductMockFn.mockReturnValue(Promise.resolve(products));

    const response = await service.findAll();

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });

  it('should return one product', async () => {
    const request: GetProductResponse = {
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
      photo_url: 'https://ab1',
      notes: 'notes about product',
    };

    findOneProductMockFn.mockReturnValue(Promise.resolve(request));

    const response = await service.findOne('6398b92f5eeb9d5a289e3411');

    expect(response.name).toEqual('string');
    expect(response.code).toEqual('ab');
  });

  it('should remove product', async () => {
    deleteOneMockFn.mockReturnValue(Promise.resolve('deleteone'));

    const res = await service.remove('ab');

    expect(res).toEqual('deleteone');
  });

  it('should emit a message with suggestion product', async () => {
    findOneProductMockFn.mockReturnValue(Promise.resolve({ name: 'product' }));
    const suggestedProduct: SuggestProductRequest = {
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
      notes: 'notes about product',
    };

    const userPayload: Payload = {
      email: 'cisab@cisab.com',
      roles: [Role.Admin],
      sub: '1234',
    };

    await service.suggest(suggestedProduct, userPayload);

    expect(emitMockFn).toBeCalledTimes(1);
  });
});
