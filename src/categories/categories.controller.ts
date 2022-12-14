import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryRequest } from './dto/create-category-request.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { GetCategoryResponse } from './dto/get-category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Find all categories', description: 'forbidden' })
  @ApiBody({ type: CreateCategoryRequest })
  @ApiResponse({ type: [GetCategoryResponse] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.categoriesService.find();
  }

  @ApiOperation({ summary: 'Create new category', description: 'forbidden' })
  @ApiBody({ type: CreateCategoryRequest })
  @ApiResponse({ type: GetCategoryResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  async create(@Body() req: CreateCategoryRequest) {
    return this.categoriesService.create(req);
  }

  @ApiOperation({ summary: 'delete category', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
