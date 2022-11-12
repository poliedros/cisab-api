import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './parse-objectid.pipe';

describe('parse object id', () => {
  it('should parse object id with valid value', async () => {
    const pipe = new ParseObjectIdPipe();

    const res = pipe.transform('6363c2f363e9deb5a8e1c672');

    expect(res).toBeInstanceOf(Types.ObjectId);
  });

  it('should throw badrequest with invalid data', async () => {
    const pipe = new ParseObjectIdPipe();

    try {
      pipe.transform('6363c2f363e9deb5a8e1c67');
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
