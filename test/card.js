import { expect } from 'chai';

import { Card } from '..';

let aceOfSpades, kingOfHearts, sevenOfClubs;

beforeEach(() => {
  aceOfSpades = new Card('As');
  kingOfHearts = new Card({ suit: Card.HEARTS, rank: Card.KING });
  sevenOfClubs = new Card('7c');
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
      expect(aceOfSpades.suit).to.equal(Card.SPADES);
      expect(kingOfHearts.suit).to.equal(Card.HEARTS);
      expect(sevenOfClubs.suit).to.equal(Card.CLUBS);
    });

    it('sets the suit correctly', () => {
      aceOfSpades.suit = Card.DIAMONDS;
      expect(aceOfSpades.suit).to.equal(Card.DIAMONDS);
      expect(aceOfSpades.code).to.equal('Ad');
    });
  });

  describe('.rank', () => {
    it('returns the correct rank', () => {
      expect(aceOfSpades.rank).to.equal(Card.ACE);
      expect(kingOfHearts.rank).to.equal(Card.KING);
      expect(sevenOfClubs.rank).to.equal(7);
    });

    it('sets the rank correctly', () => {
      aceOfSpades.rank = 10;
      expect(aceOfSpades.rank).to.equal(10);
      expect(aceOfSpades.code).to.equal('10s');
    });
  });

});
