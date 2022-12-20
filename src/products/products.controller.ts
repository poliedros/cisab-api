import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { GetProductResponse } from './dto/response/get-product-response.dto';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';

const TWO_MBs = 2097152;

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductRequest) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  findAll(
    @Query('category') categories: string[],
  ): Promise<GetProductResponse[]> {
    return this.productsService.findAll({ categories });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductRequest,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return this.productsService.remove(id);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/image')
  uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: TWO_MBs })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return `File size: ${file.size} bytes`;
  }
}
