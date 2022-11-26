import { Types } from 'mongoose';
import { CountyEntity } from './county.entity';

describe('county entity spec', () => {
  it('should not update county_id attribute', () => {
    const id = '63599affb40135010840911b';
    const idStub = new Types.ObjectId(id);
    const countyEntity = new CountyEntity('saae', null, null, idStub);

    expect(countyEntity.county_id.toString()).toEqual(id);
  });
});
