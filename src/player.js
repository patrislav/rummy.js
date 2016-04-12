class Player {

  /**
   * Constructs the Player object
   *
   * @param {any} identity The custom player identifier
   */
  constructor(identity) {
    this.identity = identity;
    this.cards = new Array();
    this.drewFromDiscard = null; // {Card}
    this.melded = false; // {boolean}
    this.madeFirstMove = false; // {boolean}
  }

  /**
   * Draws a card from the given pile. It can be a Pile object or a string,
   * one of: 'stock' or 'discard'.
   *
   * @param {object|string} pile
   * @return {Card} card
   */
  draw(pile) {
    if (typeof pile == 'undefined') {
      return null;
    }

    let card;

    if (typeof pile == 'string') {
      switch(pile) {
      case 'stock':
        card = this.rummy.stock.pop();
        this.drewFromDiscard = null;
        break;
      case 'discard':
        card = this.rummy.discard.pop();
        this.drewFromDiscard = card;
        break;
      }
    }
    else if (pile.pop) {
      card = pile.pop();
      this.drewFromDiscard = (pile.discard ? card : null);
    }

    if (card) {
      this.cards.push(card);
      return card;
    }

    return null;
  }

  /**
   * Discards the given card and return it to the discard pile
   *
   * @param {Card} card
   * @return {Card} discarded
   */
  discard(card) {
    let discarded = null;
    for (let i in this.cards) {
      if ((typeof card == 'string' && this.cards[i].code === card)
      || (card.code && card === this.cards[i])) {
        discarded = this.cards[i];
        this.cards.splice(i, 1);
        this.rummy.discard.push(discarded);
        break;
      }
    }
    return discarded;
  }

}

export default Player;
