import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from './../../database/abstract.schema';

export type ForgetPasswordDocument = ForgetPassword & Document;

@Schema({ versionKey: false })
export class ForgetPassword extends AbstractDocument {
  @Prop()
  userId: string;

  @Prop()
  oldPassword?: string;

  @Prop()
  newPassword?: string;
}

export const ForgetPasswordSchema =
  SchemaFactory.createForClass(ForgetPassword);
