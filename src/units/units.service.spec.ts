import { Unit } from './schemas/unit.schema';
import { CreateUnitRequest } from './dto/create-unit-request.dto';
import { UnitsRepository } from './units.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UnitsService } from './units.service';
import { Types } from 'mongoose';
import { ConflictException } from '@nestjs/common';

describe('UnitsService', () => {
  let service: UnitsService;
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
        UnitsService,
        {
          provide: UnitsRepository,
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

    service = module.get<UnitsService>(UnitsService);
  });

  it('should create unit with valid data', async () => {
    const req: CreateUnitRequest = {
      name: 'cm',
    };
    createMockFn.mockReturnValue(Promise.resolve({ _id: '12', ...req }));
    findMockFn.mockReturnValue(Promise.resolve([]));

    const unit = await service.create(req);

    expect(unit._id).toEqual('12');
    expect(unit.name).toEqual('cm');
  });

  it('shouldnt create unit if duplicated name were given', async () => {
    const idString = '63599affb40135010840911b';
    const id = new Types.ObjectId(idString);

    const unit: Unit = { _id: id, name: 'cm' };

    const req: CreateUnitRequest = {
      name: 'cm',
    };
    createMockFn.mockReturnValue(Promise.resolve({ _id: '12', ...req }));
    findMockFn.mockReturnValue(Promise.resolve(unit));

    try {
      await service.create(req);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
    }
  });

  it('should find units', async () => {
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

  it('should find one unit', async () => {
    findOneMock.mockReturnValue(Promise.resolve({ _id: '1', name: 'cm' }));

    const unit = await service.findOne({ _id: '1' });

    expect(unit._id).toEqual('1');
    expect(unit.name).toEqual('cm');
  });
});
