import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';
import { DemandState } from '../enums/demand-state.enum';

export type DemandDocument = Demand & Document;

@Schema({ versionKey: false })
export class Demand extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  product_ids: string[];

  @Prop()
  state: DemandState | undefined;

  @Prop()
  created_on: Date;
}

export const DemandSchema = SchemaFactory.createForClass(Demand);
