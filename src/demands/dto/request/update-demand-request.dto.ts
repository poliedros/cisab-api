import { PartialType } from '@nestjs/swagger';
import { CreateDemandRequest } from './create-demand-request.dto';

export class UpdateDemandRequest extends PartialType(CreateDemandRequest) {}
