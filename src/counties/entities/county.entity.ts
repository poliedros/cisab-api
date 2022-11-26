import { Types } from 'mongoose';

export class InfoEntity {
  mayor: string;
  population: string;
  flag: string;
  anniversary: string;
  distanceToCisab: string;
  note: string;
}

export class ContactEntity {
  address: string;
  zipCode: string;
  phone: string;
  speakTo: string;
  email: string;
  socialMedia: string;
  note: string;
}

export class CountyEntity {
  private readonly _county_id?: Types.ObjectId;

  constructor(
    public name: string,
    public info?: InfoEntity,
    public contact?: ContactEntity,
    county_id?: Types.ObjectId,
  ) {
    this._county_id = county_id;
  }

  get county_id() {
    return this._county_id;
  }
}
