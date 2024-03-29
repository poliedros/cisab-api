import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { CountiesService } from '../counties/counties.service';
import { DemandsService } from '../demands/demands.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CartsCacheRepository } from './carts.cache.repository';
import { CartsMongoRepository } from './carts.mongo.repository';
import { CartDto, CartProductDto, CartProductIdDto } from './dto/cart.dto';
import { CartsRequest } from './dto/request/carts-request.dto';

@Injectable()
export class CartsService {
  protected readonly logger = new Logger(CartsService.name);

  constructor(
    private readonly cartsCacheRepository: CartsCacheRepository,
    private readonly cartsMongoRepository: CartsMongoRepository,
    private readonly productsService: ProductsService,
    private readonly demandsService: DemandsService,
    private readonly usersService: UsersService,
    private readonly countiesService: CountiesService,
  ) {}

  async upsert(
    cart: CartsRequest,
    countyId: string,
    userId: string,
  ): Promise<CartDto> {
    const existCart = await this.cartsMongoRepository.findOneOrReturnUndefined({
      county_id: countyId,
      demand_id: cart.demand_id,
    });

    if (existCart) throw new BadRequestException('This cart is already closed');

    const ids = cart.products.map((id) => id.product_id);

    const products = await this.productsService.findAll({
      ids,
      categories: null,
    });

    const productsWithQuantity = products.map((product) => ({
      ...cart.products.find(
        (cartProduct) =>
          cartProduct.product_id === product._id.toString() && cartProduct,
      ),
      ...product,
    }));

    const cartProducts = productsWithQuantity.map((product): CartProductDto => {
      return {
        _id: product._id.toString(),
        name: product.name,
        norms: product.norms,
        categories: product.categories,
        photo_url: product.photo_url,
        measurements: product.measurements,
        quantity: product.quantity,
      };
    });

    const { name: demand_name } = await this.demandsService.findOne(
      cart.demand_id,
    );

    const { name: userName, surname: userSurname } =
      await this.usersService.findOne({ _id: userId });

    const fullName = `${userName} ${userSurname}`;

    const { name: county_name } = await this.countiesService.findOne(countyId);

    let cartDto: CartDto = new CartDto();
    cartDto = {
      _id: new Types.ObjectId().toString(),
      user_id: userId,
      state: 'opened',
      updated_on: new Date(),
      product_ids: cart.products,
      products: cartProducts,
      demand_name,
      demand_id: cart.demand_id,
      user_name: fullName,
      county_id: countyId,
      county_name,
    };

    await this.cartsCacheRepository.upsert(cartDto);
    return cartDto;
  }

  async get(
    county_id: string,
    demand_id: string,
    user_id: string,
  ): Promise<CartDto> {
    // If cart is already closed, it will be on Mongo
    const cart = await this.cartsMongoRepository.findOneOrReturnUndefined({
      county_id: county_id,
      demand_id: demand_id,
    });
    if (cart) return { ...cart, _id: cart._id.toString() };

    // If cart is on the cache, return it
    const cachedCart = await this.cartsCacheRepository.get(
      county_id,
      demand_id,
    );
    if (cachedCart) return cachedCart;

    // Cart is not on the cache, so generate it

    const demand = await this.demandsService.findOne(demand_id);

    const productsWithQuantity = demand.products.map<CartProductDto>(
      (product) => {
        return { ...product, quantity: 0, _id: product._id.toString() };
      },
    );

    const productsIds = productsWithQuantity.map<CartProductIdDto>(
      (product) => {
        return {
          product_id: product._id.toString(),
          quantity: product.quantity,
        };
      },
    );

    const { name: userName, surname: userSurname } =
      await this.usersService.findOne({ _id: user_id });

    const fullName = `${userName} ${userSurname}`;

    const { name: county_name } = await this.countiesService.findOne(county_id);

    const cartDto: CartDto = {
      _id: new Types.ObjectId().toString(),
      user_id: user_id,
      state: 'opened',
      updated_on: new Date(),
      product_ids: productsIds,
      products: productsWithQuantity,
      demand_name: demand.name,
      demand_id: demand_id,
      user_name: fullName,
      county_id: county_id,
      county_name,
    };

    await this.cartsCacheRepository.upsert(cartDto);

    return cartDto;
  }

  async close(county_id: string, demand_id: string) {
    try {
      const existCart =
        await this.cartsMongoRepository.findOneOrReturnUndefined({
          county_id: county_id,
          demand_id: demand_id,
        });

      if (existCart)
        throw new BadRequestException('This cart is already closed');

      const cart = await this.cartsCacheRepository.get(county_id, demand_id);

      return this.cartsMongoRepository.close({
        ...cart,
        _id: new Types.ObjectId(cart._id),
      });
    } catch (err) {
      throw err;
    }
  }
}
