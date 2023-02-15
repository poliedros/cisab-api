import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

export type CartDocument = Cart & Document;

class CartProduct {
  _id: string;
  quantity: number;
}

@Schema({ versionKey: false })
export class Cart extends AbstractDocument {
  @Prop()
  state: 'open' | 'closed';

  @Prop()
  products: CartProduct[];

  @Prop()
  county_id: string;

  @Prop()
  demand_id: string;

  @Prop()
  updated_on: Date;

  @Prop()
  user_id: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
