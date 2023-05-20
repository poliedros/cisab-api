import { Types } from 'mongoose';
import { Product } from '../schemas/product.schema';

type ProductSchemaFactoryProps = {
  id: Types.ObjectId | undefined;
  name: string;
  measurements: { name: string; value: string; unit: string }[];
  norms: string[];
  code: string;
  accessory_ids: string[];
  categories: string[];
  notes: string;
};

export class ProductSchemaFactory {
  static create({
    id,
    name,
    measurements,
    norms,
    code,
    accessory_ids,
    categories,
    notes,
  }: ProductSchemaFactoryProps): Product {
    return {
      _id: id,
      name,
      measurements,
      norms,
      code,
      accessory_ids,
      categories,
      notes,
    } as Product;
  }
}
