import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { CountiesService } from '../counties/counties.service';
import { DemandsService } from '../demands/demands.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CartsCacheRepository } from './carts.cache.repository';
import { CartsMongoRepository } from './carts.mongo.repository';
import { CartDto, CartProductDto } from './dto/cart.dto';
import { CartsRequest } from './dto/request/carts-request.dto';
import { GetCartResponse } from './dto/response/get-cart-response.dto';

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

    const cartDto: CartDto = {
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

    return this.cartsCacheRepository.upsert(cartDto);
  }

  async get(county_id: string, demand_id: string): Promise<GetCartResponse> {
    const cart = await this.cartsMongoRepository.findOneOrReturnUndefined({
      county_id: county_id,
      demand_id: demand_id,
    });

    if (cart) return { ...cart, _id: cart._id.toString() };

    return this.cartsCacheRepository.get(county_id, demand_id);
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
