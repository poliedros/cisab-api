import { CreateCategoryRequest } from './dto/create-category-request.dto';
import { CategoriesService } from './categories.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { BadRequestException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const findMockFn = jest.fn();
  const createMockFn = jest.fn();
  const removeMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            find: findMockFn,
            create: createMockFn,
            remove: removeMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should get all categories from database', async () => {
    const findMockResponse = [{ _id: '635aece69b8ac8a5056875a', name: 'cm' }];
    findMockFn.mockReturnValue(Promise.resolve(findMockResponse));

    const response = await controller.getAll();

    expect(response[0].name).toEqual('cm');
  });

  it('should create category with unique name', async () => {
    const req: CreateCategoryRequest = {
      name: 'cm',
    };

    createMockFn.mockReturnValue({ _id: '12', ...req });

    const response = await controller.create(req);

    expect(response._id).toEqual('12');
    expect(response.name).toEqual('cm');
  });

  it('should remove if category id is valid', async () => {
    const idStub = '636a91af3dab2ee1a847934b';
    await controller.remove(idStub);

    expect(removeMockFn).toBeCalledTimes(1);
  });

  it('should throw bad request with invalid id in remove', async () => {
    try {
      const idStub = '63599affb4013501084091';
      await controller.remove(idStub);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
});
