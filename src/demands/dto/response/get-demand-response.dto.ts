import { DemandState } from '../../enums/demand-state.enum';
import { Measure } from '../../../products/entities/product.entity';
import { Types } from 'mongoose';

export class GetDemandProductResponse {
  _id: Types.ObjectId;
  name: string;
  measurements: Measure[];
  norms: string[];
  code: string;
  accessories: GetDemandProductResponse[];
  categories: string[];
  photo_url: string;
}

export class GetDemandResponse {
  _id: Types.ObjectId;
  name: string;
  start_date: Date;
  end_date: Date;
  products: GetDemandProductResponse[];
  state: DemandState | undefined;
  created_on: Date;
}
