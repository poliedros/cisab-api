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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';

const TWO_MBs = 2097152;

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
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductRequest,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
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
