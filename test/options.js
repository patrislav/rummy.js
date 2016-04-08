import { expect } from 'chai';

import Rummy from '..';

describe('Rummy.options()', () => {

  describe('when called without arguments', () => {
    it('returns default options', () => {
      let rummy = new Rummy();
      expect(rummy.options())
        .to.be.an('object');
    });
  });

  describe('when called with an object', () => {
    it('sets the options', () => {
      let rummy = new Rummy();
      rummy.options({ option1: 'value1', option2: 'value2' });
      expect(rummy.options('option1'))
        .to.be.equal('value1');
      expect(rummy.options('option2'))
        .to.be.equal('value2');
    });

    it("doesn't change the previously set options", () => {
      let rummy = new Rummy();
      rummy.options({ option1: 'value1', option2: 'value2' });
      rummy.options({ option3: 'value3' });
      expect(rummy.options('option1'))
        .to.be.equal('value1');
    });

    it('changes the previously set option if it was provided', () => {
      let rummy = new Rummy();
      rummy.options({ option1: 'value1', option2: 'value2' });
      rummy.options({ option1: 'changed-value' });
      expect(rummy.options('option1'))
        .to.be.equal('changed-value');
    });
  });

});
