import { expect } from 'chai';

import Rummy from '..';

const rummy = new Rummy();

describe('Rummy.Group', () => {
  describe('constructor', () => {
    it('adds the valid cards', () => {
      let group = new rummy.Group('As 6h 8c Jd');
      expect(group.cards).to.have.length(4);
    });

    it('filters out the invalid cards', () => {
      let group = new rummy.Group('As invalid 5h 4g ws');
      expect(group.cards).to.have.length(2);
    });

    describe("with the 'jokers' option", () => {
      it('adds the jokers', () => {
        rummy.options({ jokers: true });
        let group = new rummy.Group('As X 8d X 5d');
        expect(group.cards).to.have.length(5);
      });
    });

    describe("without the 'jokers' option", () => {
      it("doesn't add the jokers", () => {
        rummy.options({ jokers: false });
        let group = new rummy.Group('As X 8d X 5d');
        expect(group.cards).to.have.length(3);
      });
    });
  });

  describe('.valid', () => {

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
      [{ suit: 0, rank: 11 }, { suit: 0, rank: 11 }, { suit: 0, rank: 12 }],
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

    validGroups.forEach(item => {
      let group = new rummy.Group(item);
      it(`${group} is valid`, () => {
        expect(group.valid).to.be.true;
      });
    });

    invalidGroups.forEach(item => {
      let group = new rummy.Group(item);
      it(`${group} is invalid`, () => {
        expect(group.valid).to.be.false;
      });
    });

    describe("with 'jokers' option", () => {
      validJokerGroups.forEach(item => {
        rummy.options({ jokers: true });
        let group = new rummy.Group(item);
        it(`${group} is valid`, () => {
          expect(group.valid).to.be.true;
        });
      });

      invalidJokerGroups.forEach(item => {
        rummy.options({ jokers: true });
        let group = new rummy.Group(item);
        it(`${group} is invalid`, () => {
          expect(group.valid).to.be.false;
        });
      });
    });

    describe("without 'jokers' option", () => {
      validJokerGroups.concat(invalidJokerGroups).forEach(item => {
        rummy.options({ jokers: false });
        let group = new rummy.Group(item);
        it(`${group} is invalid`, () => {
          expect(group.valid).to.be.false;
        });
      });
    });
  });

  describe('.type', () => {
    describe('when the group is invalid', () => {
      it("returns 'invalid'", () => {
        let group = new rummy.Group('3d 4c 5h');
        expect(group.type).to.equal('invalid');
      });
    });

    describe('when the group is a set', () => {
      it("returns 'set'", () => {
        let group = new rummy.Group('Kh Kc Ks');
        expect(group.type).to.equal('set');
      });
    });

    describe('when the group is a run', () => {
      it("returns 'run'", () => {
        let group = new rummy.Group('6d X 7d 8d');
        expect(group.type).to.equal('run');
      });
    });
  });

  describe('.toString()', () => {
    describe('when created with a string', () => {
      it('returns the same string', () => {
        let group = new rummy.Group('4d 5d 6d');
        expect(group.toString()).to.equal('4d 5d 6d');
      });
    });

    describe('when created with an array of card codes', () => {
      it('returns the correct string', () => {
        let group = new rummy.Group(['10s', 'Js', 'Qs']);
        expect(group.toString()).to.equal('10s Js Qs');
      });
    });

    describe('when created with an array of Card objects', () => {
      it('returns the correct string', () => {
        let group = new rummy.Group([
          new rummy.Card('3h'),
          new rummy.Card('3d'),
          new rummy.Card('3c')
        ]);
        expect(group.toString()).to.equal('3h 3d 3c');
      });
    });
  });
});
