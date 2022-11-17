import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const createMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: { create: createMockFn } },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should creat', async () => {
    const request: CreateProductRequest = {
      name: 'string',
      measurements: [
        {
          name: 'width',
          value: '3',
          unit: 'cm',
        },
      ],
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
});
