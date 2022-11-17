import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductSchemaFactory } from './factories/product-schema.factory';
import { ProductsRepository } from './products.repository';
import { UnitsService } from '../units/units.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly unitsService: UnitsService,
  ) {}

  async create({ name, measurements }: CreateProductRequest) {
    const productEntity = new ProductEntity(name, measurements);

    for (const measure of productEntity.measurements) {
      try {
        await this.unitsService.findOne({ name: measure.unit });
      } catch (err) {
        throw new BadRequestException("Unit doesn't exist");
      }
    }

    const productSchema = ProductSchemaFactory.create(productEntity);

    const session = await this.productsRepository.startTransaction();
    try {
      const product = await this.productsRepository.create(productSchema, {
        session,
      });

      await session.commitTransaction();
      this.logger.log(`product id ${product._id} saved`);

      return product;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
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