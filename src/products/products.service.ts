import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductSchemaFactory } from './factories/product-schema.factory';
import { ProductsRepository } from './products.repository';
import { UnitsService } from '../units/units.service';
import { CategoriesService } from '../categories/categories.service';
import { SuggestProductRequest } from './dto/request/suggest-product-request.dto';
import { NotifierService } from '../notifier/notifier.service';
import { Payload } from 'src/auth/auth.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly unitsService: UnitsService,
    private readonly categoriesService: CategoriesService,
    private readonly notifierService: NotifierService,
  ) {}

  async create({
    name,
    measurements,
    accessory_ids,
    categories,
    code,
    norms,
    notes,
  }: CreateProductRequest) {
    const productEntity = new ProductEntity(
      name,
      measurements,
      norms,
      code,
      accessory_ids,
      categories,
      notes,
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

  findAll(filter: { categories: string[]; ids: string[] } = undefined) {
    if (filter && filter.categories)
      return this.productsRepository.find({
        categories: { $in: filter.categories },
      });

    if (filter && filter.ids)
      return this.productsRepository.find({
        _id: { $in: filter.ids },
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

  async uploadImage(id: string, file: Express.Multer.File) {
    const product = await this.productsRepository.findOne({ _id: id });

    product.photo_url = 'https://i.ibb.co/6tmJqXm/SEM-IMAGEM.png';

    await this.productsRepository.upsert({ _id: id }, product);
  }

  async suggest(
    {
      name,
      measurements,
      accessory_ids,
      categories,
      code,
      norms,
      notes,
    }: SuggestProductRequest,
    userPayload: Payload,
  ) {
    let categories_string = '';
    for (let i = 0; i < categories.length; i++) {
      categories_string += categories[i].concat('<br>');
    }

    let norms_string = '';
    for (let i = 0; i < norms.length; i++) {
      norms_string += norms[i].concat('<br>');
    }

    let measurements_string = '';
    for (let i = 0; i < measurements.length; i++) {
      measurements_string += measurements[i].name.concat(
        ' ',
        measurements[i].value,
        ' ',
        measurements[i].unit,
        '<br>',
      );
    }

    let accessories_string = '';
    for (let i = 0; i < accessory_ids.length; i++) {
      const product = await this.findOne(accessory_ids[i]);
      accessories_string += product.name.concat('<br>');
    }

    const message = {
      to: `${process.env.ADMIN_EMAIL}`,
      body: `<strong>Nome do produto</strong>: ${name} <br><br>
      <strong>Medidas</strong>: <br> ${measurements_string} <br>
      <strong>Acessórios</strong>: <br> ${accessories_string} <br>
      <strong>Categorias</strong>: <br> ${categories_string} <br>
      <strong>Normas</strong>: <br> ${norms_string} <br>
      <br> Sugerido por: ${userPayload.email}
      `,
      subject: `Sugestão de produto`,
    };
    this.logger.log(`sending email to: ${process.env.ADMIN_EMAIL}`);
    this.notifierService.emit({ type: 'send_email', message });
  }
}
