import { PartialType } from '@nestjs/swagger';
import { CreateProductRequest } from './create-product-request.dto';

export class SuggestProductRequest extends PartialType(CreateProductRequest) {}
