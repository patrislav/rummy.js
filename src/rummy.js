
import { version } from '../package.json';

const _opts = Symbol('opts');
const defaultOptions = {
  jokers: true,
  jokerPoints: 50,
  aceAfterKing: true,
  aceInSetPoints: 11
};

export class Rummy {
  static version = version;

  constructor(options) {
    this[_opts] = Object.create(defaultOptions);

    if (typeof options == 'object') {
      this.options(options);
    }
  }

  /**
   * @return {boolean} Whether the group is valid
   */
  isValidGroup(group) {
    if (group == undefined) {
      return false;
    }

    if (group.length < 3) {
      return false;
    }

    for (let card of group) {
      if (this.options('jokers') && typeof card.joker == 'number') {
        card.value = 'joker';
        card.suit = 'joker';
      }
      else {
        if (typeof card.suit != 'number' || card.suit < 0 || card.suit > 3) {
          return false;
        }

        if (typeof card.value != 'number' || card.value < 1 || card.value > 13) {
          return false;
        }
      }
    }

    let values = group.map(card => card.value),
      valuesWithoutJokers = values.filter(x => x != 'joker'),
      uniqueValues = unique(valuesWithoutJokers),
      jokerCount = values.reduce((total, x) => (x == 'joker' ? total+1 : total), 0);

    let suits = group.map(card => card.suit),
      suitsWithoutJokers = suits.filter(x => x != 'joker'),
      uniqueSuits = unique(suitsWithoutJokers, this.options('jokers'));

    if ((values.length == 3 && jokerCount > 1)
    || ( values.length == 4 && jokerCount > 2)) {
      return false;
    }

    // Set
    if (uniqueValues.length == 1 && uniqueSuits.length == suitsWithoutJokers.length) {
      return true;
    }

    // If there is an ace
    let aceIndex;
    if (this.options('aceAfterKing') && (aceIndex = valuesWithoutJokers.indexOf(1))) {
      if (values.indexOf(13) || (jokerCount > 0 && values.indexOf(12))) {
        valuesWithoutJokers[aceIndex] = 14;
      }
      else if (!values.indexOf(2) && !(jokerCount > 0 && values.indexOf(3))) {
        return false;
      }
    }

    // Run
    if (uniqueSuits.length == 1 && uniqueValues.length == valuesWithoutJokers.length
    && isConsecutive(valuesWithoutJokers, jokerCount)) {
      return true;
    }

    return false;
  }

  /**
   * @param {Object|String} keyOrOpts One key to get that option or an object
   * with options to set
   * @return {Object|String} All options if called without arguments, or one
   * value when used with key
   */
  options(keyOrOpts) {
    let opts = this[_opts];

    if (!keyOrOpts) {
      return opts;
    }

    if (typeof keyOrOpts === 'string') {
      return (keyOrOpts in opts) ? opts[keyOrOpts] : null;
    }

    for (let i in keyOrOpts) {
      opts[i] = keyOrOpts[i];
    }
  }
}

export default Rummy;

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
