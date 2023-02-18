import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DemandsService } from '../demands/demands.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CartsRepository } from './carts.repository';
import { CartDto, CartProductDto } from './dto/cart.dto';
import { CartsRequest } from './dto/request/carts-request.dto';
import { GetCartResponse } from './dto/response/get-cart-response.dto';

@Injectable()
export class CartsService {
  protected readonly logger = new Logger(CartsService.name);

  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly productsService: ProductsService,
    private readonly demandsService: DemandsService,
    private readonly usersService: UsersService,
  ) {}

  async upsert(
    cart: CartsRequest,
    countyId: string,
    userId: string,
  ): Promise<CartDto> {
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

    const { name: demandName } = await this.demandsService.findOne(
      cart.demand_id,
    );

    const { name: userName, surname: userSurname } =
      await this.usersService.findOne({ _id: userId });

    const fullName = `${userName} ${userSurname}`;

    const cartDto: CartDto = {
      _id: new Types.ObjectId().toString(),
      user_id: userId,
      state: 'OPEN',
      updated_on: new Date(),
      product_ids: cart.products,
      products: cartProducts,
      demandName,
      demand_id: cart.demand_id,
      userName: fullName,
      county_id: countyId,
    };

    return this.cartsRepository.upsert(cartDto);
  }

  get(county_id: string, demand_id: string): Promise<GetCartResponse> {
    return this.cartsRepository.get(county_id, demand_id);
  }

  close(county_id: string, demand_id: string) {
    try {
      return this.cartsRepository.close(county_id, demand_id);
    } catch (err) {
      throw err;
    }
  }
}
