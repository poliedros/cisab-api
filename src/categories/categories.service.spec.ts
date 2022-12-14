import { Category } from './schemas/category.schema';
import { CreateCategoryRequest } from './dto/create-category-request.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Types } from 'mongoose';
import { ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

describe('CategoriesService', () => {
  let service: CategoriesService;
  const findMockFn = jest.fn();
  const findOneMock = jest.fn();
  const createMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
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
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            find: findMockFn,
            findOne: findOneMock,
            create: createMockFn,
            deleteOne: deleteOneMockFn,
            startTransaction: startTransactionMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should create category with valid data', async () => {
    const req: CreateCategoryRequest = {
      name: 'cm',
    };
    createMockFn.mockReturnValue(Promise.resolve({ _id: '12', ...req }));
    findMockFn.mockReturnValue(Promise.resolve([]));

    const category = await service.create(req);

    expect(category._id).toEqual('12');
    expect(category.name).toEqual('cm');
  });

  it('shouldnt create category if duplicated name were given', async () => {
    const idString = '63599affb40135010840911b';
    const id = new Types.ObjectId(idString);

    const category: Category = { _id: id, name: 'cm' };

    const req: CreateCategoryRequest = {
      name: 'cm',
    };
    createMockFn.mockReturnValue(Promise.resolve({ _id: '12', ...req }));
    findMockFn.mockReturnValue(Promise.resolve(category));

    try {
      await service.create(req);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
    }
  });

  it('should find categories', async () => {
    const findResponse = [{ _id: '12', name: 'cm' }];
    findMockFn.mockReturnValue(Promise.resolve(findResponse));

    const response = await service.find();

    expect(response[0]._id).toEqual('12');
  });

  it('should remove given id', async () => {
    const idStub = '636a91af3dab2ee1a847934b';
    await service.remove(idStub);

    expect(deleteOneMockFn).toBeCalledTimes(1);
  });

  it('should find one category', async () => {
    findOneMock.mockReturnValue(Promise.resolve({ _id: '1', name: 'cm' }));

    const category = await service.findOne({ _id: '1' });

    expect(category._id).toEqual('1');
    expect(category.name).toEqual('cm');
  });
});
