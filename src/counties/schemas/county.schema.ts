import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from './../../database/abstract.schema';

export type CountyDocument = County & Document;

export class Account {
  user: string;
  password: string;
}

export class CountyData {
  name: string;
  state: string;
  mayor: string;
  population: string;
  flag: string;
  anniversary: string;
  distanceToCisab: string;
  note: string;
  address: string;
  zipCode: string;
  phone: string;
  contact: string;
  site: string;
  email: string;
  socialMedias: string;
}

export class CountyInfo {
  name: string;
  job: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  socialMedias: string;
  note: string;
}

@Schema({ versionKey: false })
export class County extends AbstractDocument {
  @Prop({ type: Account })
  account: Account;

  @Prop({ type: CountyData })
  county: CountyData;

  @Prop({ type: CountyInfo })
  accountable: CountyInfo;
}

export const CountySchema = SchemaFactory.createForClass(County);
