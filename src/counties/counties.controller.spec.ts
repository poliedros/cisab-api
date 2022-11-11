import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesController } from './counties.controller';
import { CountiesService } from './counties.service';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { CreateCountyDto } from './dto/request/create-county.dto';
import { UpdateCountyUserRequest } from './dto/request/update-county-user-request.dto';
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
  jest.resetAllMocks();

  let controller: CountiesController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const updateMockFn = jest.fn();
  const removeMockFn = jest.fn();
  const createCountyUserMockFn = jest.fn();
  const findCountyUsersMockFn = jest.fn();
  const updateCountyUserMockFn = jest.fn();

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
            createCountyUser: createCountyUserMockFn,
            findCountyUsers: findCountyUsersMockFn,
            updateCountyUser: updateCountyUserMockFn,
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
      findAllMockFn.mockReturnValue(undefined);
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

  it('should throw bad request in creation if service throws an error', async () => {
    createMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await controller.create({} as CreateCountyDto);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw not when finding one found with valid id', async () => {
    try {
      const idStub = '63599affb40135010840911b';
      findOneMockFn.mockReturnValue(undefined);
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

  it('should throw bad request when updating with invalid id', async () => {
    try {
      const idString = '63599affb4013501084091';
      const idStub = new Types.ObjectId('63599affb40135010840911b');
      const county = { _id: idStub, ...buildCounty() };
      await controller.update(idString, county);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw bad request when deleting with invalid id', async () => {
    try {
      const idString = '63599affb40135010840911';
      await controller.remove(idString);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create a county user', async () => {
    const properties: Map<string, string> = new Map<string, string>();
    properties['profession'] = 'software engineer';
    properties['county_id'] = '1';
    const req: CreateCountyUserRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      properties,
    };

    createCountyUserMockFn.mockReturnValue(
      Promise.resolve({ _id: '12', ...req }),
    );

    const response = await controller.createCountyUser('1', req);

    expect(response._id).toEqual('12');
    expect(response.properties['county_id']).toEqual('1');
  });

  it('should find all county users', async () => {
    const countyUser = {
      _id: '6363d75a63e9deb5a8e1c6cd',
      email: 'vicosa@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      properties: {
        profession: 'software developer',
      },
    };

    findCountyUsersMockFn.mockReturnValue(Promise.resolve([countyUser]));
    const response = await controller.findCountyUser(
      '6363c2f363e9deb5a8e1c672',
    );

    expect(response[0]._id).toEqual('6363d75a63e9deb5a8e1c6cd');
    expect(response[0].email).toEqual('vicosa@cisab.com');
    expect(response[0].name).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].properties).not.toBeUndefined();
  });

  it('should update county user', async () => {
    const id = new Types.ObjectId('63599affb40135010840911b');

    const countyUser = {
      _id: id,
      email: 'vicosa2@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      properties: new Map<string, string>(),
    };
    countyUser.properties.set('profession', 'software engineer');

    updateCountyUserMockFn.mockReturnValue(Promise.resolve(countyUser));

    const response = await controller.updateCountyUser(
      '6363d75a63e9deb3a9e1c2cj',
      countyUser,
    );

    expect(response._id).toEqual(id);
    expect(response.email).toEqual('vicosa2@cisab.com');
    expect(response.name).toEqual('cisab');
    expect(response.surname).toEqual('cisab');
    expect(response.surname).toEqual('cisab');
    expect(response.properties).not.toBeUndefined();
  });
});
