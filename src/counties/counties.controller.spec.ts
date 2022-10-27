import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesController } from './counties.controller';
import { CountiesService } from './counties.service';
import { CreateCountyDto } from './dto/create-county.dto';
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

describe('CountiesController', () => {
  let controller: CountiesController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const updateMockFn = jest.fn();
  const removeMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountiesController],
      providers: [
        {
          provide: CountiesService,
          useValue: {
            create: createMockFn,
            findAll: findAllMockFn,
            findOne: findOneMockFn,
            update: updateMockFn,
            remove: removeMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<CountiesController>(CountiesController);
  });

  it('should get all', async () => {
    const id = new Types.ObjectId('63599affb40135010840911b');
    const county: County = {
      _id: id,
      ...buildCounty(),
    };

    findAllMockFn.mockReturnValue(Promise.resolve([county]));

    const counties = await controller.findAll();

    expect(counties[0]._id).toEqual(id);
  });

  it('should throw not found if there is no counties', async () => {
    try {
      await controller.findAll();
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should create county', async () => {
    const countyDto: CreateCountyDto = buildCounty();

    const idStub = new Types.ObjectId('63599affb40135010840911b');
    createMockFn.mockReturnValue(
      Promise.resolve({ _id: idStub, ...countyDto }),
    );

    const result = await controller.create(countyDto);

    expect(result._id).toEqual(idStub);
  });

  it('should return one county with valid id', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const county = { _id: idStub, ...buildCounty() };

    findOneMockFn.mockReturnValue(county);

    const response = await controller.findOne(idString);

    expect(response._id).toEqual(idStub);
  });

  it('should throw bad request with invalid id', async () => {
    try {
      const idStub = '63599affb4013501084091';
      await controller.findOne(idStub);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw not found with valid id', async () => {
    try {
      const idStub = '63599affb40135010840911b';
      await controller.findOne(idStub);
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update county with valid data', async () => {
    updateMockFn.mockReturnValue(Promise.resolve(true));
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    const county = { _id: idStub, ...buildCounty() };

    const response = await controller.update(idString, county);

    expect(response).toBeDefined();
  });

  it('should remove county with valid id', async () => {
    updateMockFn.mockReturnValue(Promise.resolve(true));
    const idString = '63599affb40135010840911b';
    removeMockFn.mockReturnValue(Promise.resolve(true));

    const response = await controller.remove(idString);

    expect(response).toBeDefined();
  });
});
