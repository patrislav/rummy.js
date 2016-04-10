
import { CardConstants } from './decorators';

const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13],
  rankSymbols = {'A': 1, 'J': 11, 'Q': 12, 'K': 13},
  suitSymbols = ['s', 'h', 'd', 'c'];

@CardConstants
class Card {

  constructor(objectOrCode) {
    if (typeof objectOrCode == 'string') {
      let object = parseCardCode(objectOrCode);
      this.rank = object.rank;
      this.suit = object.suit;
    }
    else {
      if ('suit' in objectOrCode) {
        this.suit = objectOrCode.suit;
      }

      if ('rank' in objectOrCode) {
        this.rank = objectOrCode.rank;
      }
    }
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
    for (let symbol in rankSymbols) {
      if (rankSymbols[symbol] == this.rank) {
        return symbol;
      }
    }

    return this.rank.toString();
  }

  /**
   * @return {string} suitCode
   */
  get suitCode() {
    return suitSymbols[this.suit].toString();
  }
}

export default Card;


/* Private helper functions
 * ========================================================================= */

function parseCardCode(code) {
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
