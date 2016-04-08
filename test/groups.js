import { expect } from 'chai';

import Rummy from '..';

let rummy;

beforeEach(() => {
  rummy = new Rummy();
});

describe('Rummy.isValidGroup()', () => {
  describe('no arguments', () => {
    it('returns false', () => {
      expect(rummy.isValidGroup()).to.be.false;
    });
  });

  describe('an array of Group objects', () => {
    let validGroups = [
      [{ suit: 0, value: 1 }, { suit: 0, value: 2 }, { suit: 0, value: 3 }],
      [{ suit: 0, value: 6 }, { suit: 0, value: 7 }, { suit: 0, value: 5 }, { suit: 0, value: 4 }],
      [{ suit: 0, value: 9 }, { suit: 1, value: 9 }, { suit: 2, value: 9 }],
      [{ suit: 0, value: 12 }, { suit: 0, value: 13 }, { suit: 0, value: 1 }]
    ];
    let validJokerGroups = [
      [{ suit: 0, value: 4 }, { joker: 1 }, { suit: 0, value: 6 }],
      [{ suit: 0, value: 5 }, { suit: 0, value: 6 }, { joker: 1 }],
      [{ suit: 0, value: 5 }, { suit: 1, value: 5 }, { joker: 1 }],
      [{ suit: 0, value: 1 }, { joker: 1 }, { suit: 0, value: 3 }, { joker: 2 }, { suit: 0, value: 5 }],
      [{ suit: 0, value: 12 }, { joker: 1 }, { suit: 0, value: 1 }]
    ];
    let invalidGroups = [
      // Too few cards
      [{ suit: 0, value: 1 }],
      [{ suit: 0, value: 2 }, { suit: 0, value: 3 }],
      // Missing parameters
      [{ fake: 0, value: 1 }, { suit: 0, value: 2 }, { suit: 0, value: 3 }],
      [{ suit: 0, fake: 1 }, { suit: 0, value: 2 }, { suit: 0, value: 3 }],
      // Set with two cards of the same suit
      [{ suit: 0, value: 5 }, { suit: 1, value: 5 }, { suit: 1, value: 5 }],
      // Run with two cards of the same value
      [{ suit: 0, value: 11 }, { suit: 0, value: 11 }, { suit: 0, value: 12}],
      // Not a set nor a run
      [{ suit: 0, value: 1 }, { suit: 1, value: 1 }, { suit: 0, value: 2 }],
      // Incorrect suit or value
      [{ suit: 0, value: 2 }, { suit: 1, value: 2 }, { suit: 5, value: 2 }],
      [{ suit: 1, value: 14 }, { suit: 1, value: 13 }, { suit: 1, value: 12 }],
      // Almost a set but not really
      [{ suit: 0, value: 7 }, { suit: 1, value: 7 }, { suit: 2, value: 8 }],
      // Run with a gap
      [{ suit: 0, value: 2 }, { suit: 0, value: 4 }, { suit: 0, value: 5 }],
      [{ suit: 0, value: 1 }, { suit: 0, value: 3 }, { suit: 0, value: 4 }],
      [{ suit: 0, value: 11 }, { suit: 0, value: 12 }, { suit: 0, value: 1 }],
      // No wrapping ace
      [{ suit: 0, value: 13 }, { suit: 0, value: 1 }, { suit: 0, value: 2 }]
    ];
    let invalidJokerGroups = [
      // Max 1 joker in 3-card group
      [{ joker: 1 }, { suit: 0, value: 5 }, { joker: 2 }],
      // No two jokers next to one another
      [{ suit: 0, value: 3 }, { joker: 1 }, { joker: 2 }],
      [{ suit: 0, value: 5 }, { joker: 1 }, { joker: 2 }, { suit: 0, value: 8 }]
    ];

    validGroups.forEach((group) => {
      it(JSON.stringify(group) + ' is valid', () => {
        expect(rummy.isValidGroup(group)).to.be.true;
      });
    });

    invalidGroups.forEach((group) => {
      it(JSON.stringify(group) + ' is invalid', () => {
        expect(rummy.isValidGroup(group)).to.be.false;
      });
    });

    describe("with 'jokers' option", () => {
      const options = { jokers: true };

      validJokerGroups.forEach((group) => {
        it(JSON.stringify(group) + ' is valid', () => {
          rummy.options(options);
          expect(rummy.isValidGroup(group)).to.be.true;
        });
      });

      invalidJokerGroups.forEach((group) => {
        it(JSON.stringify(group) + ' is invalid', () => {
          rummy.options(options);
          expect(rummy.isValidGroup(group)).to.be.false;
        });
      });
    });

    describe("without 'jokers' option", () => {
      const options = { jokers: false };

      validJokerGroups.concat(invalidJokerGroups).forEach((group) => {
        it(JSON.stringify(group) + ' is invalid', () => {
          rummy.options(options);
          expect(rummy.isValidGroup(group)).to.be.false;
        });
      });
    });
  });
});
