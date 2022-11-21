import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AbstractDocument } from './../../database/abstract.schema';

export type CountyDocument = County & Document;

export class Info {
  mayor: string;
  population: string;
  flag: string;
  anniversary: string;
  distanceToCisab: string;
  note: string;
}

export class Contact {
  address: string;
  zipCode: string;
  phone: string;
  speakTo: string;
  email: string;
  socialMedia: string;
  note: string;
}

@Schema({ versionKey: false })
export class County extends AbstractDocument {
  @Prop()
  name: string;

  @Prop({ type: Info })
  info?: Info;

  @Prop({ type: Contact })
  contact?: Contact;

  @Prop()
  county_id?: Types.ObjectId;
}

export const CountySchema = SchemaFactory.createForClass(County);
