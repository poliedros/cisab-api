import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { GetProductResponse } from './dto/response/get-product-response.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const removeMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: createMockFn,
            findAll: findAllMockFn,
            findOne: findOneMockFn,
            remove: removeMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should create', async () => {
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

    const resService = {
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
    createMockFn.mockReturnValue(Promise.resolve(resService));

    const res = await controller.create(request);

    expect(res._id).toEqual('635aece69b8ac8a5056875a2');
    expect(res.name).toEqual('string');
    expect(res.measurements.length).toEqual(1);
  });

  it('should throw error in product creation', async () => {
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

    class TestException extends Error {}

    createMockFn.mockImplementation(() => {
      throw new TestException();
    });

    try {
      await controller.create(request);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestException);
    }
  });

  it('should get products by categories', async () => {
    const products: GetProductResponse[] = [
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
        photo_url: 'https://a1',
      },
    ];

    findAllMockFn.mockReturnValue(Promise.resolve(products));

    const response = await controller.findAll(['abc']);

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });

  it('should find one product', async () => {
    findOneMockFn.mockReturnValue(
      Promise.resolve({
        _id: '6398b92f5eeb9d5a289e3411',
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
      }),
    );

    const product = await controller.findOne('6398b92f5eeb9d5a289e3411');

    expect(product._id).toEqual('6398b92f5eeb9d5a289e3411');
    expect(product.name).toEqual('string');
    expect(product.code).toEqual('ab');
  });

  it('should remove product', async () => {
    removeMockFn.mockReturnValue(Promise.resolve('remove'));

    const res = await controller.remove('ab');

    expect(res).toEqual('remove');
  });

  it('should throw bad request in removing product', async () => {
    removeMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await controller.remove('ab');
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
