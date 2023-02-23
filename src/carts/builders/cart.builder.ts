import {
  CartsProductRequest,
  CartsRequest,
} from '../dto/request/carts-request.dto';

export class CartBuilder {
  private cart: CartsRequest;
  constructor() {
    this.reset();
  }

  reset() {
    this.cart = new CartsRequest();
    this.cart.products = [];
  }

  addDemandId(demand_id: string) {
    this.cart.demand_id = demand_id;
    return this;
  }

  addProduct(product: CartsProductRequest) {
    this.cart.products.push(product);
    return this;
  }

  build() {
    return this.cart;
  }
}
