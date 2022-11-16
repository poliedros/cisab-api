import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

export type ProductDocument = Product & Document;

class Measure {
  name: string;
  value: string;
  unity: string;
}

@Schema({ versionKey: false })
export class Product extends AbstractDocument {
  @Prop()
  name: string;

  @Prop({ type: Array<Measure> })
  measurements: Measure[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
