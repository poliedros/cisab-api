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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/request/create-product-request.dto';
import { UpdateProductRequest } from './dto/request/update-product-request.dto';
import { GetProductResponse } from './dto/response/get-product-response.dto';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

const TWO_MBs = 2097152;

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create new product', description: 'forbidden' })
  @ApiBody({ type: CreateProductRequest })
  @ApiResponse({ type: GetProductResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  async create(@Body() createProductDto: CreateProductRequest) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find all products', description: 'forbidden' })
  @ApiResponse({ type: [GetProductResponse] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get()
  findAll(
    @Query('category') categories: string[],
  ): Promise<GetProductResponse[]> {
    return this.productsService.findAll({ categories });
  }

  @ApiOperation({ summary: 'Find one product', description: 'forbidden' })
  @ApiResponse({ type: GetProductResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
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

  @ApiOperation({ summary: 'Delete product', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return this.productsService.remove(id);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  @ApiOperation({ summary: 'Upload product image', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/image')
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: TWO_MBs })],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.productsService.uploadImage(id, file);

    return `File size: ${file.size} bytes`;
  }
}
