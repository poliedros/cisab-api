import { Test, TestingModule } from '@nestjs/testing';
import { AbstractDocument } from './abstract.schema';
import { AbstractRepository } from './abstract.repository';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  getConnectionToken,
  getModelToken,
  InjectConnection,
  InjectModel,
} from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

class Doc extends AbstractDocument {}

class ConcreteRepository extends AbstractRepository<Doc> {
  protected readonly logger = new Logger(ConcreteRepository.name);

  constructor(
    @InjectModel(Doc.name) docModel: Model<Doc>,
    @InjectConnection() connection: Connection,
  ) {
    super(docModel, connection);
  }
}

async function buildService(useValue) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ConcreteRepository,
      {
        provide: getModelToken(Doc.name),
        useValue: useValue,
      },
      {
        provide: getConnectionToken(),
        useValue: {
          startSession: () => Promise.resolve({ startTransaction: jest.fn() }),
        },
      },
    ],
  }).compile();

  return module.get<ConcreteRepository>(ConcreteRepository);
}

describe('Abstract Repository Spec', () => {
  let repository: ConcreteRepository;
  const findOneMockFn = jest.fn();
  const findMockFn = jest.fn();
  const findOneAndUpdateMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();

  beforeEach(async () => {
    const useValue = {
      findOne: findOneMockFn,
      find: findMockFn,
      findOneAndUpdate: findOneAndUpdateMockFn,
      deleteOne: deleteOneMockFn,
    };
    repository = await buildService(useValue);
  });

  it('should create new object', async () => {
    function mockUserModel(dto: any) {
      this.data = dto;
      this.save = (options: any) => {
        return {
          toJSON: () => this.data,
        };
      };
    }

    repository = await buildService(mockUserModel);

    const response = await repository.create({});

    expect(response._id).not.toBeNull();
  });

  it('should find one with data', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const doc = { _id: idStub };
    findOneMockFn.mockReturnValue(Promise.resolve(doc));

    const response = await repository.findOne({ _id: idString });

    expect(response._id).toEqual(idStub);
  });

  it('should throw not found on findOne if there is no data', async () => {
    try {
      const idString = '63599affb40135010840911b';
      findOneMockFn.mockReturnValue(undefined);
      await repository.findOne({ _id: idString });
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should find one and update', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const doc = { _id: idStub };
    findOneAndUpdateMockFn.mockReturnValue(Promise.resolve(doc));

    const response = await repository.findOneAndUpdate({ _id: idString }, doc);

    expect(response._id).toEqual(idStub);
  });

  it('should throw not found on findOneAndUpdate if there is no data', async () => {
    try {
      const idString = '63599affb40135010840911b';
      const idStub = new Types.ObjectId(idString);
      const doc = { _id: idStub };
      findOneAndUpdateMockFn.mockReturnValue(undefined);
      await repository.findOneAndUpdate({ _id: idString }, doc);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should upsert', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const doc = { _id: idStub };
    findOneAndUpdateMockFn.mockReturnValue(Promise.resolve(doc));

    const response = await repository.upsert({ _id: idString }, doc);

    expect(response._id).toEqual(idStub);
  });

  it('should find with data', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const doc = { _id: idStub };
    findMockFn.mockReturnValue(Promise.resolve([doc]));

    const response = await repository.find({ _id: idString });

    expect(response[0]._id).toEqual(idStub);
  });

  it('should delete with data', async () => {
    const idString = '63599affb40135010840911b';
    const resultStub = {
      deletedCount: 1,
    };
    deleteOneMockFn.mockReturnValue(Promise.resolve(resultStub));

    const response = await repository.deleteOne({ _id: idString });

    expect(response.deletedCount).toEqual(1);
  });

  it('should start transaction', async () => {
    const session = await repository.startTransaction();
    expect(session).toBeDefined();
  });
});
