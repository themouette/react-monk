import assert from 'assert';
import generateConfig from '../../src/webpack/generate-config';

describe('generate-config', () => {
  it('should return a plain object', () => {
    const ret = generateConfig({});
    assert(typeof(ret) === 'object' && ret.constructor == Object);
  });
});
