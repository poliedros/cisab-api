import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesController } from './counties.controller';
import { CountiesService } from './counties.service';
import { CreateEmployeeRequest } from './dto/request/create-employee-request.dto';
import { CreateCountyRequest } from './dto/request/create-county-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { County } from './schemas/county.schema';
import { Role } from '../auth/role.enum';

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

describe('CountiesController', () => {
  jest.resetAllMocks();

  let controller: CountiesController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const updateMockFn = jest.fn();
  const removeMockFn = jest.fn();
  const createEmployeeMockFn = jest.fn();
  const findEmployeesMockFn = jest.fn();
  const updateEmployeeMockFn = jest.fn();
  const removeEmployeeMockFn = jest.fn();
  const createManagerMockFn = jest.fn();
  const isManagerActiveMockFn = jest.fn();
  const updateManagerPasswordMockFn = jest.fn();

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
            createEmployee: createEmployeeMockFn,
            findEmployees: findEmployeesMockFn,
            updateEmployee: updateEmployeeMockFn,
            removeEmployee: removeEmployeeMockFn,
            createManager: createManagerMockFn,
            isManagerActive: isManagerActiveMockFn,
            updateManagerPassword: updateManagerPasswordMockFn,
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
    const countyDto: CreateCountyRequest = buildCounty();

    const idStub = new Types.ObjectId('63599affb40135010840911b');
    createMockFn.mockReturnValue(
      Promise.resolve({ _id: idStub, ...countyDto }),
    );

    const result = await controller.create(countyDto);

    expect(result._id).toEqual(idStub);
  });

  it('should return one county with valid id by cisab', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const req = { user: { roles: [Role.Cisab] } };
    const county = { _id: idStub, ...buildCounty() };

    findOneMockFn.mockReturnValue(county);

    const response = await controller.findOne(idStub, req);

    expect(response._id).toEqual(idStub);
  });

  it('should return one county with valid id by manager/employee', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const req = { user: { roles: [Role.Manager] } };
    const county = { _id: idStub, ...buildCounty() };

    findOneMockFn.mockReturnValue(county);

    const response = await controller.findOne(idStub, req);

    expect(response._id).toEqual(idStub);
  });

  it('should throw bad request with invalid id', async () => {
    try {
      const idString = '63599affb4013501084091';
      const req = { user: { roles: [] } };
      await controller.findOne(idString, req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw bad request in creation if service throws an error', async () => {
    class TestError extends Error {}
    createMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await controller.create({} as CreateCountyRequest);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should throw not when finding one found with valid id', async () => {
    try {
      const idString = '63599affb4013501084091';
      const req = { user: { roles: [] } };
      findOneMockFn.mockReturnValue(undefined);
      await controller.findOne(idString, req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update county with valid data', async () => {
    updateMockFn.mockReturnValue(Promise.resolve(true));
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    const county = { _id: idStub, ...buildCounty() };

    const response = await controller.update(idStub, county);

    expect(response).toBeDefined();
  });

  it('should remove county with valid id', async () => {
    updateMockFn.mockReturnValue(Promise.resolve(true));
    const idString = '63599affb4013501084091';
    removeMockFn.mockReturnValue(Promise.resolve(true));

    const response = await controller.remove(idString);

    expect(response).toBeDefined();
  });

  it('should throw bad request when updating with invalid id', async () => {
    try {
      const idString = '63599affb4013501084091';
      const county = { _id: idString, ...buildCounty() };
      await controller.update(idString, county);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw bad request when deleting with invalid id', async () => {
    try {
      const idString = '63599affb4013501084091';
      await controller.remove(idString);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create a employee', async () => {
    const properties: Map<string, string> = new Map<string, string>();
    properties['profession'] = 'software engineer';
    properties['county_id'] = '1';
    const req: CreateEmployeeRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      properties,
    };

    createEmployeeMockFn.mockReturnValue(
      Promise.resolve({ _id: '12', ...req }),
    );

    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const response = await controller.createEmployee(idStub, req);

    expect(response._id).toEqual('12');
    expect(response.properties['county_id']).toEqual('1');
  });

  it('should find all employees by cisab', async () => {
    const employee = {
      _id: '6363d75a63e9deb5a8e1c6cd',
      email: 'vicosa@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      properties: {
        profession: 'software developer',
      },
    };

    findEmployeesMockFn.mockReturnValue(Promise.resolve([employee]));
    const idString = '6363c2f363e9deb5a8e1c672';
    const idStub = new Types.ObjectId(idString);
    const req = { user: { roles: [Role.Cisab] } };
    const response = await controller.findEmployee(idStub, req);

    expect(response[0]._id).toEqual('6363d75a63e9deb5a8e1c6cd');
    expect(response[0].email).toEqual('vicosa@cisab.com');
    expect(response[0].name).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].properties).not.toBeUndefined();
  });

  it('should find all employees by manager/employee', async () => {
    const employee = {
      _id: '6363d75a63e9deb5a8e1c6cd',
      email: 'vicosa@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      properties: {
        profession: 'software developer',
        county_id: 'ab',
      },
    };

    findEmployeesMockFn.mockReturnValue(Promise.resolve([employee]));
    const idString = '6363c2f363e9deb5a8e1c672';
    const idStub = new Types.ObjectId(idString);
    const req = { user: { roles: [Role.Manager], county_id: 'ab' } };
    const response = await controller.findEmployee(idStub, req);

    expect(response[0]._id).toEqual('6363d75a63e9deb5a8e1c6cd');
    expect(response[0].email).toEqual('vicosa@cisab.com');
    expect(response[0].name).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].surname).toEqual('cisab');
    expect(response[0].properties['county_id']).toEqual('ab');
  });

  it('should update employee', async () => {
    const id = new Types.ObjectId('63599affb40135010840911b');

    const employee = {
      _id: id,
      email: 'vicosa2@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      password: 'f4C1_b0ts',
      properties: new Map<string, string>(),
      roles: [Role.Employee],
    };
    employee.properties.set('profession', 'software engineer');

    updateEmployeeMockFn.mockReturnValue(Promise.resolve(employee));

    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const response = await controller.updateEmployee(idStub, employee);

    expect(response._id).toEqual(id);
    expect(response.email).toEqual('vicosa2@cisab.com');
    expect(response.name).toEqual('cisab');
    expect(response.surname).toEqual('cisab');
    expect(response.surname).toEqual('cisab');
    expect(response.properties).not.toBeUndefined();
  });

  it('should remove employee', async () => {
    removeEmployeeMockFn.mockReturnValue(Promise.resolve(true));
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);
    const res = await controller.removeEmployee(idStub);

    expect(res).toBeDefined();
  });

  it('should return county id when creating a new manager', async () => {
    const req: CreateManagerRequest = {
      email: 'email@czar.dev',
      name: 'Vicosa',
    };

    createManagerMockFn.mockReturnValue({ _id: '12a' });
    const county = await controller.createManager(req);

    expect(county.county_id).toEqual('12a');
  });

  it('should throw error when creating a new manager', async () => {
    const req: CreateManagerRequest = {
      email: 'email@czar.dev',
      name: 'Vicosa',
    };

    createManagerMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await controller.createManager(req);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should return 200 OK if manager is active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    isManagerActiveMockFn.mockReturnValue(Promise.resolve(true));

    const res = await controller.confirmManager(idStub);

    expect(res).toBeTruthy();
  });

  it('should return 401 OK if manager is active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    isManagerActiveMockFn.mockReturnValue(Promise.resolve(false));

    try {
      await controller.confirmManager(idStub);
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should bad request if confirm breaks', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    isManagerActiveMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await controller.confirmManager(idStub);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should update manager password if manager is not active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    isManagerActiveMockFn.mockReturnValue(Promise.resolve(false));

    updateManagerPasswordMockFn.mockReturnValue(Promise.resolve(true));

    const res = await controller.updateManagerPassword(idStub, {
      password: '123',
    });

    expect(res).toBeTruthy();
  });

  it('should throw unathourized response if manager is active', async () => {
    const idString = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(idString);

    isManagerActiveMockFn.mockReturnValue(Promise.resolve(true));

    try {
      await controller.updateManagerPassword(idStub, { password: '123' });
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should get county autarkies by cisab', async () => {
    findAllMockFn.mockReturnValue(Promise.resolve([{}]));
    const response = await controller.getAutarkies('1a', {
      user: { _id: '1b', county_id: '1a', roles: [Role.Cisab] },
    });

    expect(response.length).toEqual(1);
  });

  it('should get county autarkies by manager', async () => {
    findAllMockFn.mockReturnValue(Promise.resolve([{}]));
    const response = await controller.getAutarkies('1a', {
      user: { _id: '1b', county_id: '1a', roles: [Role.Manager] },
    });

    expect(response.length).toEqual(1);
  });
});
