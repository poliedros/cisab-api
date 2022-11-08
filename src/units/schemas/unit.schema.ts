import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from './../../database/abstract.schema';

export type UnitDocument = Unit & Document;

@Schema({ versionKey: false })
export class Unit extends AbstractDocument {
  @Prop()
  name: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
