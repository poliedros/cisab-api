import { Types } from 'mongoose';

export class Measure {
  name: string;
  value: string;
  unit: string;
}

export class ProductEntity {
  constructor(
    public name: string,
    measurements: Measure[],
    public norms: string[],
    public code: string,
    public accessory_ids: string[],
    public categories: string[],
    public notes: string,
  ) {
    this._measurements = measurements;
  }

  set id(id: Types.ObjectId) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  private _id: Types.ObjectId;
  private _measurements: Measure[];

  get measurements() {
    return this._measurements;
  }

  addMeasure(measure: Measure) {
    this._measurements.push(measure);
  }
}
