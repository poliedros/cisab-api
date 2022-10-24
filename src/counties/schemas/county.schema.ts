import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountyDocument = County & Document;

@Schema()
export class County {
  @Prop()
  id: string;

  @Prop()
  account: {
    user: string;
    password: string;
  };

  @Prop()
  county: {
    name: string;
    state: string;
    mayor: string;
    population: number;
    flag: string;
    anniversary: string;
    distanceToCisab: number;
    note: string;
    address: string;
    zipCode: string;
    phone: string;
    contact: string;
    site: string;
    email: string;
    socialMedias: string;
  };

  @Prop()
  accountable: {
    name: string;
    job: string;
    address: string;
    zipCode: string;
    phone: string;
    email: string;
    socialMedias: string;
    note: string;
  };
}

export const CountySchema = SchemaFactory.createForClass(County);
