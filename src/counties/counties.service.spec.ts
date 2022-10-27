import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesRepository } from './counties.repository';
import { CountiesService } from './counties.service';

function buildCounty() {
  return {
    account: {
      user: 'test',
      password: 'password',
    },
    county: {
      address: 'address',
      anniversary: '12/12/1900',
      contact: '123',
      distanceToCisab: '12',
      email: 'email@email.com',
      flag: 'flag url',
      mayor: 'osvaldo',
      name: 'New York',
      note: 'notes',
      phone: '123',
      population: '55',
      site: 'site.com',
      socialMedias: 'socialMedias url',
      state: 'state',
      zipCode: '123122-12',
    },
    accountable: {
      address: 'address',
      email: 'email@email.com',
      job: 'job',
      name: 'osvaldo',
      note: 'notes',
      phone: '12312',
      socialMedias: 'socialMedias url',
      zipCode: '123122-12',
    },
  };
}

function buildIdCountyMock() {
  const idString = '63599affb40135010840911b';
  const idStub = new Types.ObjectId(idString);
  const county = { _id: idStub, ...buildCounty() };

  return [idStub, county];
}

async function buildService(useValue) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CountiesService,
      {
        provide: CountiesRepository,
        useValue: useValue,
      },
    ],
  }).compile();

  return module.get<CountiesService>(CountiesService);
}

describe('CountiesService', () => {
  let service: CountiesService;
  const createMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const findMockFn = jest.fn();
  const upsertMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  startTransactionMockFn.mockReturnValue(
    Promise.resolve({
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }),
  );

  beforeEach(async () => {
    const useValue = {
      create: createMockFn,
      find: findMockFn,
      findOne: findOneMockFn,
      upsert: upsertMockFn,
      deleteOne: deleteOneMockFn,
      startTransaction: startTransactionMockFn,
    };

    service = await buildService(useValue);
  });

  it('should create with valid data', async () => {
    const [_, county] = buildIdCountyMock();

    createMockFn.mockReturnValue(Promise.resolve(county));

    const response = await service.create(buildCounty());

    expect(response.county.address).toEqual('address');
  });

  it('should get all counties', async () => {
    const useValue = {
      find: findMockFn,
    };
    service = await buildService(useValue);

    const [idStub, county] = buildIdCountyMock();
    const countiesStub = [county];

    findMockFn.mockReturnValue(Promise.resolve(countiesStub));

    const response = await service.findAll();

    expect(response[0]._id).toEqual(idStub);
  });
});
