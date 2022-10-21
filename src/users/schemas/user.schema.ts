import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './../../enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
