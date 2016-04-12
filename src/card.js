
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13],
  rankSymbols = {'A': 1, 'J': 11, 'Q': 12, 'K': 13},
  suitSymbols = ['s', 'h', 'd', 'c'];

class Card {

  constructor(objectOrCode) {
    if (typeof objectOrCode == 'string') {
      let object = parseCardCode(objectOrCode);
      this.rank = object.rank;
      this.suit = object.suit;
      this.joker = object.joker;
    }
    else {
      if (objectOrCode.joker) {
        this.joker = objectOrCode.joker;
        this.suit = 'joker';
        this.rank = 'joker';
      }

      if (typeof objectOrCode.suit == 'number') {
        this.suit = objectOrCode.suit;
      }

      if (typeof objectOrCode.rank == 'number') {
        this.rank = objectOrCode.rank;
      }
    }
  }

  /**
   * @return {boolean} isValid
   */
  get valid() {
    return (typeof this.rank == 'number' && this.suit >= 0 && this.suit <= 3
    && typeof this.suit == 'number' && this.rank >= 1 && this.rank <= 13)
    || !!this.joker;
  }

  /**
   * @return {string} code
   */
  get code() {
    return this.rankCode + this.suitCode;
  }

  /**
   * @param {string} newCode
   */
  set code(newCode) {
    let object = parseCardCode(newCode);
    this.rank = object.rank;
    this.suit = object.suit;
  }

  /**
   * @return {string} rankCode
   */
  get rankCode() {
    if (this.rank === 'joker') {
      return 'X';
    }

    for (let symbol in rankSymbols) {
      if (rankSymbols[symbol] == this.rank) {
        return symbol;
      }
    }

    if (this.rank) {
      return this.rank.toString();
    }

    return '';
  }

  /**
   * @return {string} suitCode
   */
  get suitCode() {
    if (suitSymbols[this.suit]) {
      return suitSymbols[this.suit].toString();
    }
    return '';
  }
}

export default Card;


/* Private helper functions
 * ========================================================================= */

function parseCardCode(code) {
  if (code === 'X') {
    return { joker: 1, suit: 'joker', rank: 'joker' };
  }

  const rankCodes = ranks.concat(Object.keys(rankSymbols)),
    regex = new RegExp(`(${rankCodes.join('|')})(${suitSymbols.join('|')})`, 'g');

  const match = regex.exec(code);

  if (!match) {
    return false;
  }

  let rank = ((match[1] in rankSymbols) ? rankSymbols[match[1]] : parseInt(match[1])),
    suit = suitSymbols.indexOf(match[2]);

  return { rank, suit };
}
