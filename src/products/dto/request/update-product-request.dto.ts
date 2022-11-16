import { PartialType } from '@nestjs/swagger';
import { CreateProductRequest } from './create-product-request.dto';

export class UpdateProductRequest extends PartialType(CreateProductRequest) {}
