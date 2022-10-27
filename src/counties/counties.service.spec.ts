import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CountiesService } from './counties.service';
import { County } from './schemas/county.schema';

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

async function buildService(useValue) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CountiesService,
      {
        provide: getModelToken(County.name),
        useValue: useValue,
      },
    ],
  }).compile();

  return module.get<CountiesService>(CountiesService);
}

describe('CountiesService', () => {
  let service: CountiesService;
  const findOneMockFn = jest.fn();
  const findMockFn = jest.fn();

  function mockUserModel(dto: any) {
    this.data = dto;
    this.findOne = findOneMockFn;
    this.find = findMockFn;
    this.save = () => {
      return this.data;
    };
  }

  it('should create with valid data', async () => {
    service = await buildService(mockUserModel);

    const response = await service.create(buildCounty());

    expect(response.county.address).toEqual('address');
  });

  it('should get all counties', async () => {
    const useValue = {
      find: findMockFn,
    };
    service = await buildService(useValue);

    const idStub = '63599affb40135010840911b';
    const countiesStub = { id: idStub, ...buildCounty() };

    findMockFn.mockReturnValue({
      exec: () => [countiesStub],
    });

    const counties = await service.findAll();

    expect(counties[0].id).toEqual(idStub);
  });
});
