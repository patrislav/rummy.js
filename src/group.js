
import Card from './card';

const _type = Symbol('type');

class Group {

  constructor(group) {
    if (typeof group == 'string') {
      group = group.trim().replace(/(\s+)/g, ' ').split(' ');
    }

    this.cards = group.map((card) => new Card(card)).filter(x => x.valid);
    if (!this.rummy.options('jokers')) {
      this.cards = this.cards.filter(x => !x.joker);
    }
  }

  toString() {
    return this.cards.map(x => x.code).join(' ');
  }

  get type() {
    return this.valid ? this[_type] : 'invalid';
  }

  set type(newType) {
    this[_type] = newType;
  }

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
      this.type = 'set';
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
      this.type = 'run';
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
