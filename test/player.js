import { expect } from 'chai';
import Rummy from '..';

let rummy, player;

beforeEach(() => {
  rummy = new Rummy();
  player = new rummy.Player('player-id');
});

describe('Player', () => {

  describe('constructor', () => {
    it('sets identity', () => {
      expect(player.identity).to.equal('player-id');
    });

    it('sets the rummy object', () => {
      expect(player.rummy).to.deep.equal(rummy);
    });
  });

  describe('.draw()', () => {
    describe('with no arguments', () => {
      it('returns null', () => {
        expect(player.draw()).to.be.null;
      });
    });

    describe('with an invalid string', () => {
      it('returns null', () => {
        let card = player.draw('invalid');
        expect(card).to.be.null;
      });
    });

    describe("with a 'stock' string", () => {
      let cards;
      beforeEach(() => {
        cards = [
          new rummy.Card('4h'),
          new rummy.Card('8d'),
          new rummy.Card('As')
        ];
      });

      it('returns the correct card', () => {
        rummy.stock.cards = cards.slice();
        let card = player.draw('stock');
        expect(card).to.deep.equal(cards[cards.length-1]);
      });

      it('removes the card from the stock', () => {
        rummy.stock.cards = cards.slice();
        let card = player.draw('stock');
        expect(rummy.stock.cards).to.not.include(card);
        expect(rummy.stock.top.code).to.equal('8d');
      });

      it('sets drewFromDiscard to null', () => {
        player.drewFromDiscard = { fake: 'object' };
        rummy.stock.cards = cards.slice();
        player.draw('stock');
        expect(player.drewFromDiscard).to.be.null;
      });

      it('places the card in the hand', () => {
        player.cards = [];
        rummy.stock.cards = cards.slice();
        let card = player.draw('stock');
        expect(player.cards).to.include(card);
      });
    });

    describe("with a 'discard' string", () => {
      let cards;
      beforeEach(() => {
        cards = [
          new rummy.Card('4h'),
          new rummy.Card('8d'),
          new rummy.Card('As')
        ];
      });

      it('returns the correct card', () => {
        rummy.discard.cards = cards.slice();
        let card = player.draw('discard');
        expect(card).to.deep.equal(cards[cards.length-1]);
      });

      it('removes the card from the discard pile', () => {
        rummy.discard.cards = cards.slice();
        let card = player.draw('discard');
        expect(rummy.discard.cards).to.not.include(card);
        expect(rummy.discard.top.code).to.equal('8d');
      });

      it('sets the drewFromDiscard property', () => {
        player.drewFromDiscard = null;
        rummy.discard.cards = cards.slice();
        let card = player.draw('discard');
        expect(player.drewFromDiscard).to.deep.equal(card);
      });

      it('places the card in the hand', () => {
        player.cards = [];
        rummy.discard.cards = cards.slice();
        let card = player.draw('discard');
        expect(player.cards).to.include(card);
      });
    });

    describe('with a Pile object', () => {
      let cards;
      beforeEach(() => {
        cards = [
          new rummy.Card('4h'),
          new rummy.Card('8d'),
          new rummy.Card('As')
        ];
      });

      it('returns the correct card', () => {
        let pile = new rummy.Pile(cards);
        let card = player.draw(pile);
        expect(card).to.deep.equal(cards[cards.length-1]);
      });

      it('removes the card from the pile', () => {
        let pile = new rummy.Pile(cards);
        let card = player.draw(pile);
        expect(pile).to.not.include(card);
        expect(pile.top.code).to.equal('8d');
      });

      it('places the card in the hand', () => {
        player.cards = [];
        let pile = new rummy.Pile(cards);
        let card = player.draw(pile);
        expect(player.cards).to.include(card);
      });

      describe("when it's not a discard pile", () => {
        it('sets drewFromDiscard to null', () => {
          player.drewFromDiscard = { fake: 'object' };
          let pile = new rummy.Pile(cards, {discard: false});
          player.draw(pile);
          expect(player.drewFromDiscard).to.be.null;
        });
      });

      describe('when it is a discard pile', () => {
        it('sets the drewFromDiscard property', () => {
          player.drewFromDiscard = null;
          let pile = new rummy.Pile(cards, {discard: true});
          let card = player.draw(pile);
          expect(player.drewFromDiscard).to.deep.equal(card);
        });
      });
    });
  });

  describe('.discard()', () => {
    let cards;
    beforeEach(() => {
      cards = [
        new rummy.Card('4h'),
        new rummy.Card('8d'),
        new rummy.Card('As')
      ];
    });

    describe('when player has cards in hand', () => {
      it('returns the discarded card', () => {
        player.cards = cards.slice();
        let card = player.discard(cards[1]);
        expect(card).to.deep.equal(cards[1]);
      });

      it('removes the card from the hand', () => {
        player.cards = cards.slice();
        player.discard(cards[1]);
        expect(player.cards).to.not.include(cards[1]);
      });

      it('places the card in the discard pile', () => {
        rummy.discard = [];
        player.cards = cards.slice();
        let card = player.cards[1];
        player.discard(card);
        expect(rummy.discard).to.include(card);
      });
    });

    describe('when player has no cards in hand', () => {
      it('returns null', () => {
        let card = new rummy.Card('2h');
        player.cards = [];
        let result = player.discard(card);
        expect(result).to.be.null;
      });

      it("doesn't change the discard pile", () => {
        let card = new rummy.Card('2h');
        rummy.discard = cards.slice();
        player.cards = [];
        player.discard(card);
        expect(rummy.discard).to.deep.equal(cards);
      });

      it("doesn't change the cards in hand", () => {
        let card = new rummy.Card('2h');
        player.cards = [];
        player.discard(card);
        expect(player.cards).to.be.empty;
      });
    });
  });

});
