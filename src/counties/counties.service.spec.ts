import { NotifierService } from './../notifier/notifier.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesRepository } from './counties.repository';
import { CountiesService } from './counties.service';
import { of } from 'rxjs';
import { UsersService } from '../users/users.service';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { Role } from '../auth/role.enum';
import { UpdateCountyUserRequest } from './dto/request/update-county-user-request.dto';
import { CreateCountyRequest } from './dto/request/create-county-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { UpdateCountyRequest } from './dto/request/update-county-request.dto';
import { County } from './schemas/county.schema';

function buildCounty(): CreateCountyRequest {
  return {
    name: 'vicosa',
    info: {
      mayor: 'osvaldo',
      population: '55',
      flag: 'flag',
      anniversary: '01/01/1970',
      distanceToCisab: '8km',
      note: 'notes',
    },
    contact: {
      address: 'address',
      zipCode: '123122-12',
      phone: '12312',
      speakTo: 'john',
      email: 'email@email.com',
      socialMedia: 'socialMedias url',
      note: 'notes',
    },
  };
}

function buildIdCountyMock() {
  const idString = '63599affb40135010840911b';
  const idStub = new Types.ObjectId(idString);
  const county = { _id: idStub, ...buildCounty() };

  return [idStub, county];
}
const emitMockFn = jest.fn();

async function buildService(
  countyRepositoryMocksValue,
  usersServiceMocksValue,
) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CountiesService,
      {
        provide: CountiesRepository,
        useValue: countyRepositoryMocksValue,
      },
      {
        provide: NotifierService,
        useValue: {
          emit: emitMockFn,
        },
      },
      {
        provide: UsersService,
        useValue: usersServiceMocksValue,
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
  const findOneAndUpdateMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  const findCountyUserMockFn = jest.fn();
  const updateCountyUserMockFn = jest.fn();
  const removeCountyUserMockFn = jest.fn();
  const findOneCountyUserMock = jest.fn();
  startTransactionMockFn.mockReturnValue(
    Promise.resolve({
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }),
  );

  const createCountyUserMockFn = jest.fn();

  beforeEach(async () => {
    const countyRepositoryMocksValue = {
      create: createMockFn,
      find: findMockFn,
      findOne: findOneMockFn,
      upsert: upsertMockFn,
      deleteOne: deleteOneMockFn,
      startTransaction: startTransactionMockFn,
      findOneAndUpdate: findOneAndUpdateMockFn,
    };

    const usersServiceMockValue = {
      create: createCountyUserMockFn,
      find: findCountyUserMockFn,
      update: updateCountyUserMockFn,
      remove: removeCountyUserMockFn,
      findOne: findOneCountyUserMock,
    };

    service = await buildService(
      countyRepositoryMocksValue,
      usersServiceMockValue,
    );
  });

  it('should create with valid data', async () => {
    const [, county] = buildIdCountyMock();

    emitMockFn.mockReturnValue(of(Promise.resolve(true)));
    createMockFn.mockReturnValue(Promise.resolve(county));

    const response = await service.create(buildCounty());

    expect(response.info.distanceToCisab).toEqual('8km');
  });

  it('should get all counties', async () => {
    const useValue = {
      find: findMockFn,
    };
    service = await buildService(useValue, {});

    const [idStub, county] = buildIdCountyMock();
    const countiesStub = [county];

    findMockFn.mockReturnValue(Promise.resolve(countiesStub));

    const response = await service.findAll();

    expect(response[0]._id).toEqual(idStub);
  });

  it('should create a county user', async () => {
    const properties: Map<string, string> = new Map<string, string>();
    properties['profession'] = 'software engineer';
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

    const response = await service.createCountyUser('1', req);

    expect(response._id).toEqual('12');
    expect(response.properties['county_id']).toEqual('1');
    expect(createCountyUserMockFn.mock.calls[0][0]['roles']).toEqual([
      Role.County,
    ]);
    expect(createCountyUserMockFn).toBeCalledTimes(1);
  });

  it('should find all county users', async () => {
    const countyUser = {
      _id: '6363c4be63e9deb5a8e1c674',
      email: 'vicosa@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      password: 'admin',
      properties: {
        profession: 'software developer',
      },
    };

    findCountyUserMockFn.mockReturnValue(Promise.resolve([countyUser]));

    const countyUserRes = await service.findCountyUsers(
      '6363c2f363e9deb5a8e1c672',
    );

    expect(countyUserRes[0]._id).toEqual('6363c4be63e9deb5a8e1c674');
  });

  it('should update county user', async () => {
    const id = new Types.ObjectId('6363c2f363e9deb5a8e1c672');
    const email = 'email@email.com';
    const name = 'carlos';
    const surname = 'carlosurname';
    const password = 'f4c3_bots';
    const properties: Map<string, string> = new Map<string, string>();
    properties['profession'] = 'software engineer';

    const request: UpdateCountyUserRequest = {
      _id: id,
      email,
      name,
      surname,
      password,
      properties,
    };

    updateCountyUserMockFn.mockReturnValue(
      Promise.resolve({
        _id: id,
        email: email,
        name: name,
        surname: surname,
        properties: properties,
      }),
    );

    const response = await service.updateCountyUser(id.toString(), request);

    expect(response._id).toEqual(id);
    expect(response.email).toEqual(email);
    expect(response.name).toEqual(name);
    expect(response.surname).toEqual(surname);
    expect(response.password).not.toEqual(password);
    expect(response.properties).toEqual(properties);
  });

  it('should remove county user', async () => {
    removeCountyUserMockFn.mockReturnValue(Promise.resolve(true));
    const res = await service.removeCountyUser('6363c2f363e9deb5a8e1c672');

    expect(res).toBeDefined();
  });

  it('should create manager', async () => {
    const req: CreateManagerRequest = {
      email: 'email@czar.dev',
      name: 'Vicosa',
    };

    createMockFn.mockReturnValue({ _id: '12a' });

    const county = await service.createManager(req);

    expect(county._id).toEqual('12a');
  });

  it('should not create manager', async () => {
    const req: CreateManagerRequest = {
      email: 'email@czar.dev',
      name: 'Vicosa',
    };

    createMockFn.mockImplementation(() => {
      throw new Error('error');
    });

    try {
      await service.createManager(req);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should check if manager is active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    findOneCountyUserMock.mockReturnValue({});

    const res = await service.isManagerActive(idStub);

    expect(res).toBeFalsy();
  });

  it('should check if manager is not active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    findOneCountyUserMock.mockReturnValue({ password: '12a' });

    const res = await service.isManagerActive(idStub);

    expect(res).toBeTruthy();
  });

  it('should update manager password', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const user = {
      _id: idStub,
      name: 'carlos',
      surname: 'carlos',
      email: 'email@email.com',
      roles: [Role.Manager],
      properties: new Map<string, string>(),
    };

    findOneCountyUserMock.mockReturnValue(Promise.resolve(user));
    const res = await service.updateManagerPassword(idStub, 'password');

    expect(res).toBeTruthy();
  });

  it('should return false if something bad occurs', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    findOneCountyUserMock.mockImplementation(() => {
      throw new Error();
    });

    const res = await service.updateManagerPassword(idStub, 'password');

    expect(res).toBeFalsy();
  });

  it('should not change original county_id', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    const countyId = '63599affb401350103409112';

    const updateCountyRequest: UpdateCountyRequest = {
      name: 'county',
      info: {
        anniversary: '01/01/1920',
        distanceToCisab: '2',
        mayor: 'nivald',
        note: 'notes',
        population: '343',
        flag: 'url',
      },
      contact: {
        address: '123 address',
        email: 'email@email.com',
        phone: '12345678',
        note: 'notes',
        socialMedia: 'facebbok',
        speakTo: 'john',
        zipCode: 'f32',
      },
    };

    const updatedCountyId = '637ed84aa43d43b46f0cd1cf';
    const updatedCountyIdStub = new Types.ObjectId(updatedCountyId);

    const county: County = {
      _id: idStub,
      name: 'updated county',
      info: {
        anniversary: '01/01/1920',
        distanceToCisab: '2',
        mayor: 'nivald',
        note: 'notes',
        population: '343',
        flag: 'url',
      },
      contact: {
        address: '123 address',
        email: 'email@email.com',
        phone: '12345678',
        note: 'notes',
        socialMedia: 'facebbok',
        speakTo: 'john',
        zipCode: 'f32',
      },
      county_id: updatedCountyIdStub,
    };

    findOneMockFn.mockReturnValue(Promise.resolve(county));

    findOneAndUpdateMockFn.mockReturnValue(Promise.resolve(county));

    const res = await service.update(countyId, updateCountyRequest);

    expect(res.county_id).toEqual(updatedCountyIdStub);
  });
});
