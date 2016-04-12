import { expect } from 'chai';

import Rummy from '..';

let rummy, aceOfSpades, kingOfHearts, sevenOfClubs;

beforeEach(() => {
  rummy = new Rummy();
  aceOfSpades = new rummy.Card('As');
  kingOfHearts = new rummy.Card({ suit: Rummy.HEARTS, rank: Rummy.KING });
  sevenOfClubs = new rummy.Card('7c');
});

describe('Card', () => {

  describe('.code', () => {
    it('returns the correct code', () => {
      expect(aceOfSpades.code).to.equal('As');
      expect(kingOfHearts.code).to.equal('Kh');
      expect(sevenOfClubs.code).to.equal('7c');
    });

    it('sets the code correctly', () => {
      aceOfSpades.code = '10d';
      expect(aceOfSpades.code).to.equal('10d');
    });
  });

  describe('.suit', () => {
    it('returns the correct suit', () => {
      expect(aceOfSpades.suit).to.equal(Rummy.SPADES);
      expect(kingOfHearts.suit).to.equal(Rummy.HEARTS);
      expect(sevenOfClubs.suit).to.equal(Rummy.CLUBS);
    });

    it('sets the suit correctly', () => {
      aceOfSpades.suit = Rummy.DIAMONDS;
      expect(aceOfSpades.suit).to.equal(Rummy.DIAMONDS);
      expect(aceOfSpades.code).to.equal('Ad');
    });
  });

  describe('.rank', () => {
    it('returns the correct rank', () => {
      expect(aceOfSpades.rank).to.equal(Rummy.ACE);
      expect(kingOfHearts.rank).to.equal(Rummy.KING);
      expect(sevenOfClubs.rank).to.equal(7);
    });

    it('sets the rank correctly', () => {
      aceOfSpades.rank = 10;
      expect(aceOfSpades.rank).to.equal(10);
      expect(aceOfSpades.code).to.equal('10s');
    });
  });

  describe('.valid', () => {
    describe('when the card is valid', () => {
      it('returns true', () => {
        expect(aceOfSpades.valid).to.be.true;
        expect(kingOfHearts.valid).to.be.true;
        expect(sevenOfClubs.valid).to.be.true;
        expect(new rummy.Card('X').valid).to.be.true;
      });
    });

    describe('when the card is invalid', () => {
      it('returns false', () => {
        expect(new rummy.Card('invalid').valid).to.be.false;
        expect(new rummy.Card('aS').valid).to.be.false;
      });
    });
  });

});
