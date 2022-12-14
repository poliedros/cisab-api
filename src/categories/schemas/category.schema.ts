import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category extends AbstractDocument {
  @Prop()
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
