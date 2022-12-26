import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

export type ProductDocument = Product & Document;

class Measure {
  name: string;
  value: string;
  unit: string;
}

@Schema({ versionKey: false })
export class Product extends AbstractDocument {
  @Prop()
  name: string;

  @Prop({ type: Array<Measure> })
  measurements: Measure[];

  @Prop()
  norms: string[];

  @Prop()
  code: string;

  @Prop()
  accessory_ids: string[];

  @Prop()
  categories: string[];

  @Prop()
  photo_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
