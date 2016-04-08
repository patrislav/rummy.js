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
      [{ suit: 0, rank: 1 }, { suit: 0, rank: 2 }, { suit: 0, rank: 3 }],
      [{ suit: 0, rank: 6 }, { suit: 0, rank: 7 }, { suit: 0, rank: 5 }, { suit: 0, rank: 4 }],
      [{ suit: 0, rank: 9 }, { suit: 1, rank: 9 }, { suit: 2, rank: 9 }],
      [{ suit: 0, rank: 12 }, { suit: 0, rank: 13 }, { suit: 0, rank: 1 }]
    ];
    let validJokerGroups = [
      [{ suit: 0, rank: 4 }, { joker: 1 }, { suit: 0, rank: 6 }],
      [{ suit: 0, rank: 5 }, { suit: 0, rank: 6 }, { joker: 1 }],
      [{ suit: 0, rank: 5 }, { suit: 1, rank: 5 }, { joker: 1 }],
      [{ suit: 0, rank: 1 }, { joker: 1 }, { suit: 0, rank: 3 }, { joker: 2 }, { suit: 0, rank: 5 }],
      [{ suit: 0, rank: 12 }, { joker: 1 }, { suit: 0, rank: 1 }]
    ];
    let invalidGroups = [
      // Too few cards
      [{ suit: 0, rank: 1 }],
      [{ suit: 0, rank: 2 }, { suit: 0, rank: 3 }],
      // Missing parameters
      [{ fake: 0, rank: 1 }, { suit: 0, rank: 2 }, { suit: 0, rank: 3 }],
      [{ suit: 0, fake: 1 }, { suit: 0, rank: 2 }, { suit: 0, rank: 3 }],
      // Set with two cards of the same suit
      [{ suit: 0, rank: 5 }, { suit: 1, rank: 5 }, { suit: 1, rank: 5 }],
      // Run with two cards of the same rank
      [{ suit: 0, rank: 11 }, { suit: 0, rank: 11 }, { suit: 0, rank: 12}],
      // Not a set nor a run
      [{ suit: 0, rank: 1 }, { suit: 1, rank: 1 }, { suit: 0, rank: 2 }],
      // Incorrect suit or rank
      [{ suit: 0, rank: 2 }, { suit: 1, rank: 2 }, { suit: 5, rank: 2 }],
      [{ suit: 1, rank: 14 }, { suit: 1, rank: 13 }, { suit: 1, rank: 12 }],
      // Almost a set but not really
      [{ suit: 0, rank: 7 }, { suit: 1, rank: 7 }, { suit: 2, rank: 8 }],
      // Run with a gap
      [{ suit: 0, rank: 2 }, { suit: 0, rank: 4 }, { suit: 0, rank: 5 }],
      [{ suit: 0, rank: 1 }, { suit: 0, rank: 3 }, { suit: 0, rank: 4 }],
      [{ suit: 0, rank: 11 }, { suit: 0, rank: 12 }, { suit: 0, rank: 1 }],
      // No wrapping ace
      [{ suit: 0, rank: 13 }, { suit: 0, rank: 1 }, { suit: 0, rank: 2 }]
    ];
    let invalidJokerGroups = [
      // Max 1 joker in 3-card group
      [{ joker: 1 }, { suit: 0, rank: 5 }, { joker: 2 }],
      // No two jokers next to one another
      [{ suit: 0, rank: 3 }, { joker: 1 }, { joker: 2 }],
      [{ suit: 0, rank: 5 }, { joker: 1 }, { joker: 2 }, { suit: 0, rank: 8 }]
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

describe('Rummy.normaliseGroup()', () => {
  describe('given no arguments', () => {
    it('returns false', () => {
      expect(rummy.normaliseGroup()).to.be.false;
    });
  });

  describe('given a valid string', () => {
    let expected = [
      { suit: 0, rank: 5 }, { suit: 0, rank: 6 }, { suit: 0, rank: 7},
      { joker: 1 }, { suit: 0, rank: 9 }
    ];

    it('returns correct Group object', () => {
      let input = '5s 6s 7s X 9s';

      expect(rummy.normaliseGroup(input)).to.deep.equal(expected);
    });

    it('handles padded string correctly', () => {
      let input = '  5s  6s 7s  X   9s ';

      expect(rummy.normaliseGroup(input)).to.deep.equal(expected);
    });
  });

  describe('given an invalid string', () => {
    it('returns false', () => {
      let input = '5d Ae 6s is';

      expect(rummy.normaliseGroup(input)).to.be.false;
    });
  });
});

describe('Rummy.parseCardCode()', () => {
  describe('given no arguments', () => {
    it('returns false', () => {
      expect(rummy.parseCardCode()).to.be.false;
    });
  });

  describe('given an invalid string', () => {
    it('returns false', () => {
      let invalid = [
        'invalid', 'Ae', 'is'
      ];

      invalid.forEach((str) => {
        expect(rummy.parseCardCode(str)).to.be.false;
      });
    });
  });

  describe('given a valid string', () => {
    let matches = {
      '4d': { suit: 2, rank: 4 },
      'As': { suit: 0, rank: 1 },
      '10h': { suit: 1, rank: 10 },
      'Kc': { suit: 3, rank: 13 },
      'X': { joker: 1 }
    };

    for (let code in matches) {
      it(`code '${code}' returns valid Card object`, () => {
        expect(rummy.parseCardCode(code)).to.deep.equal(matches[code]);
      });
    }
  });
});
