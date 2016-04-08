import { expect } from 'chai';

import { Rummy } from '..';
import { version } from '../package.json';

describe('Rummy#version', () => {
  it("should be a string with this package's current version", () => {
    expect(Rummy.version)
      .to.be.a('string')
      .and.to.equal(version);
  });
});
