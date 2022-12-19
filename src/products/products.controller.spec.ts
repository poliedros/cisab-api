import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { GetProductResponse } from './dto/response/get-product-response.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: { create: createMockFn, findAll: findAllMockFn },
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
      },
    ];

    findAllMockFn.mockReturnValue(Promise.resolve(products));

    const response = await controller.findAll(['abc']);

    expect(response[0].name).toEqual('string');
    expect(response[0].categories.includes('ab')).toBeTruthy();
  });
});
