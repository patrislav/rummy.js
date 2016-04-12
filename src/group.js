
import Card from './card';

const _type = new WeakMap();

class Group {
  /**
   * @param {Object|string} group
   */
  constructor(group) {
    _type.set(this, null);

    if (typeof group == 'string') {
      group = group.trim().replace(/(\s+)/g, ' ').split(' ');
    }

    this.cards = group.map((card) => new Card(card)).filter(x => x.valid);
    if (!this.rummy.options('jokers')) {
      this.cards = this.cards.filter(x => !x.joker);
    }
  }

  /**
   * @return {string} The string representation of the Group
   */
  toString() {
    return this.cards.map(x => x.code).join(' ');
  }

  /**
   * @return {string} type Either a 'run' or a 'set'
   */
  get type() {
    return this.valid ? _type.get(this) : 'invalid';
  }

  /**
   * @return {boolean} Whether the Group is valid
   */
  get valid() {
    let group = this.cards;
    if (!group) {
      return false;
    }

    if (group.length < 3) {
      return false;
    }

    let ranks = group.map(card => card.rank),
      ranksWithoutJokers = ranks.filter(x => x != 'joker'),
      uniqueValues = unique(ranksWithoutJokers),
      jokerCount = ranks.reduce((total, x) => (x == 'joker' ? total+1 : total), 0);

    let suits = group.map(card => card.suit),
      suitsWithoutJokers = suits.filter(x => x != 'joker'),
      uniqueSuits = unique(suitsWithoutJokers);

    if ((ranks.length == 3 && jokerCount > 1)
    || ( ranks.length == 4 && jokerCount > 2)) {
      return false;
    }

    // Set
    if (uniqueValues.length == 1 && uniqueSuits.length == suitsWithoutJokers.length) {
      _type.set(this, 'set');
      return true;
    }

    // If there is an ace
    let aceIndex = ranksWithoutJokers.indexOf(1);
    if (aceIndex && this.rummy.options('acePosition') === 'both') {
      if (ranks.indexOf(13) || (jokerCount > 0 && ranks.indexOf(12))) {
        ranksWithoutJokers[aceIndex] = 14;
      }
      else if (!ranks.indexOf(2) && !(jokerCount > 0 && ranks.indexOf(3))) {
        return false;
      }
    }
    else if (aceIndex && this.rummy.options('acePosition') === 'high') {
      ranksWithoutJokers[aceIndex] = 14;
    }

    // Run
    if (uniqueSuits.length == 1 && uniqueValues.length == ranksWithoutJokers.length
    && isConsecutive(ranksWithoutJokers, jokerCount)) {
      _type.set(this, 'run');
      return true;
    }

    return false;
  }
}

export default Group;


/* Private helper functions
 * ========================================================================= */

function unique(array) {
  let seen = new Set();
  return array.filter((item) => {
    if (!seen.has(item)) {
      seen.add(item);
      return true;
    }
  });
}

function isConsecutive(array, jokerCount) {
  array.sort();

  for (let i = 0; i < array.length-1; i++) {
    if (array[i+1] !== array[i]+1) {
      if (jokerCount > 0 && array[i+1] === array[i]+2) {
        jokerCount -= 1;
      }
      else {
        return false;
      }
    }
  }
  return true;
}
