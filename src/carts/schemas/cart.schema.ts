import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

export type CartDocument = Cart & Document;

class CartMeasurementDto {
  name: string;
  value: string;
  unit: string;
}

export class CartProduct {
  _id: string;
  name: string;
  norms: string[];
  categories: string[];
  photo_url: string;
  measurements: CartMeasurementDto[];
  quantity: number;
}

export class CartProductIds {
  product_id: string;
  quantity: number;
}

@Schema({ versionKey: false })
export class Cart extends AbstractDocument {
  @Prop()
  state: 'opened' | 'closed';

  @Prop({ type: CartProduct })
  products: CartProduct[];

  @Prop()
  user_id: string;

  @Prop()
  updated_on: Date;

  @Prop({ type: CartProductIds })
  product_ids: CartProductIds[];

  @Prop()
  demand_name: string;

  @Prop()
  demand_id: string;

  @Prop()
  user_name: string;

  @Prop()
  county_id: string;

  @Prop()
  county_name: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
