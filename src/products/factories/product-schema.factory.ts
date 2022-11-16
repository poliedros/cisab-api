import { Types } from 'mongoose';
import { Product } from '../schemas/product.schema';

type ProductSchemaFactoryProps = {
  id: Types.ObjectId | undefined;
  name: string;
  measurements: { name: string; value: string; unity: string }[];
};

export class ProductSchemaFactory {
  static create({
    id,
    name,
    measurements,
  }: ProductSchemaFactoryProps): Product {
    return { _id: id, name, measurements } as Product;
  }
}
