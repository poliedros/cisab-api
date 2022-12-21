import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductSchemaFactory } from './factories/product-schema.factory';
import { ProductsRepository } from './products.repository';
import { UnitsService } from '../units/units.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly unitsService: UnitsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create({
    name,
    measurements,
    accessory_ids,
    categories,
    code,
    norms,
  }: CreateProductRequest) {
    const productEntity = new ProductEntity(
      name,
      measurements,
      norms,
      code,
      accessory_ids,
      categories,
    );

    for (const measure of productEntity.measurements) {
      try {
        await this.unitsService.findOne({ name: measure.unit });
      } catch (err) {
        throw new BadRequestException("Unit doesn't exist");
      }
    }

    for (const category of productEntity.categories) {
      try {
        await this.categoriesService.findOne({ name: category });
      } catch (err) {
        throw new BadRequestException("Category doesn't exist");
      }
    }

    for (const accessoryId of productEntity.accessory_ids) {
      try {
        await this.productsRepository.findOne({ _id: accessoryId });
      } catch (err) {
        throw new BadRequestException("Accessory doesn't exist");
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

  findAll(filter: { categories: string[] } = undefined) {
    if (filter && filter.categories)
      return this.productsRepository.find({
        categories: { $all: filter.categories },
      });

    return this.productsRepository.find({});
  }

  findOne(id: string) {
    return this.productsRepository.findOne({ _id: id });
  }

  update(id: number, updateProductDto: UpdateProductRequest) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return this.productsRepository.deleteOne({ _id: id });
  }
}
