import { Role } from '../../auth/role.enum';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

type UserEntityProps = {
  email: string;
  name: string;
  surname: string;
  roles: Role[];
  properties: Map<string, string>;
};

export class UserEntity {
  private _id: Types.ObjectId;
  public email: string;
  public name: string;
  public surname: string;
  public roles: Role[];

  private _password: string;
  private _properties?: Map<string, string>;

  constructor({ email, name, surname, roles, properties }: UserEntityProps) {
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.roles = roles;
    this._properties = properties;
  }

  public get password(): string {
    return this._password;
  }

  async setPassword(value: string) {
    this._password = await this.hashPassword(value);
  }

  get properties(): Map<string, string> {
    return this._properties;
  }

  addProperty(key: string, value: string) {
    return this._properties.set(key, value);
  }

  set id(id: Types.ObjectId) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
