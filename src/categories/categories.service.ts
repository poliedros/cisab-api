import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryRequest } from './dto/create-category-request.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async find() {
    return this.categoriesRepository.find({});
  }

  async findOne(filterQuery: FilterQuery<Category>) {
    return this.categoriesRepository.findOne(filterQuery);
  }

  async create(createCategoryRequest: CreateCategoryRequest) {
    const session = await this.categoriesRepository.startTransaction();
    try {
      const uniqueCategory = await this.categoriesRepository.find({
        name: createCategoryRequest.name,
      });

      if (uniqueCategory.length !== 0) {
        throw new ConflictException('Category already exists');
      }

      const category = await this.categoriesRepository.create(
        createCategoryRequest,
        {
          session,
        },
      );

      await session.commitTransaction();

      return category;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  remove(id: string) {
    this.logger.log(`category id: ${id} will be deleted...`);
    return this.categoriesRepository.deleteOne({ _id: id });
  }
}
