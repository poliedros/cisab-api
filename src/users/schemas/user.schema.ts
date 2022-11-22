import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../../database/abstract.schema';
import { Role } from '../../auth/role.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  name?: string;

  @Prop()
  surname?: string;

  @Prop()
  password?: string;

  @Prop()
  roles: Role[];

  @Prop({ type: Map<string, string>, default: null })
  properties?: Map<string, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
