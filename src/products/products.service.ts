import { Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductSchemaFactory } from './factories/product-schema.factory';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  create({ name, measurements }: CreateProductRequest) {
    const productEntity = new ProductEntity(name, measurements);

    const productSchema = ProductSchemaFactory.create(productEntity);

    console.log(productSchema);

    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductRequest) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
