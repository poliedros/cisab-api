import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartBuilder } from './builders/cart.builder';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import {
  CartsProductRequest,
  CartsRequest,
} from './dto/request/carts-request.dto';

describe('CartsController', () => {
  let controller: CartsController;
  const upsertMockFn = jest.fn();
  const getMockFn = jest.fn();
  const closeMockFn = jest.fn();
  const cartBuilder = new CartBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: {
            upsert: upsertMockFn,
            get: getMockFn,
            close: closeMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    cartBuilder.reset();
  });

  it('should upsert cart', async () => {
    const req = { user: { county_id: '1', id: '2' } };

    const cart = cartBuilder
      .addDemandId('2')
      .addProduct({
        product_id: '12',
        quantity: 3,
      })
      .build();

    upsertMockFn.mockReturnValue(Promise.resolve(true));
    const res = await controller.upsertCart(cart, req);

    expect(res).toBeTruthy();
  });

  it('should throw bad request in upsert cart', async () => {
    class TestError extends Error {}

    try {
      const req = { user: { county_id: '1', id: '2' } };

      const cart = cartBuilder
        .addDemandId('2')
        .addProduct({
          product_id: '12',
          quantity: 3,
        })
        .build();

      upsertMockFn.mockImplementation(() => {
        throw new TestError();
      });
      await controller.upsertCart(cart, req);
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should get cart', async () => {
    const req = { user: { county_id: '1', id: '2' } };
    getMockFn.mockReturnValue(Promise.resolve(true));
    const res = await controller.getCart('1a', req);
    expect(res).toBeTruthy();
  });

  it('should throw bad request in get cart', async () => {
    class TestError extends Error {}

    try {
      const req = { user: { county_id: '1', id: '2' } };
      getMockFn.mockImplementation(() => {
        throw new TestError();
      });
      await controller.getCart('1a', req);
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should close cart', async () => {
    const req = { user: { county_id: '1', id: '2' } };
    closeMockFn.mockReturnValue(Promise.resolve(true));
    const res = await controller.closeCart('1a', req);
    expect(res).toBeTruthy();
  });

  it('should throw bad request in close cart', async () => {
    try {
      const req = { user: { county_id: '1', id: '2' } };
      closeMockFn.mockImplementation(() => {
        throw new Error();
      });
      await controller.closeCart('1a', req);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
