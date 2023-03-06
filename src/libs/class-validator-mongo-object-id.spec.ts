import { IsObjectId } from './class-validator-mongo-object-id';

describe('is object id', () => {
  it('should return a decorator', () => {
    const res = IsObjectId({});

    expect(res).toBeDefined();
  });
});
