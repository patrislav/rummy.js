
import { version } from '../package.json';

const _opts = Symbol('opts');

export class Rummy {
  static version = version;

  constructor() {
    this[_opts] = {};
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
      if (typeof card.suit != 'number' || card.suit < 0 || card.suit > 3) {
        return false;
      }

      if (typeof card.value != 'number' || card.value < 1 || card.value > 13) {
        return false;
      }
    }

    let values = group.map(card => card.value).sort(),
      uniqueValues = unique(values);
    let suits = group.map(card => card.suit).sort(),
      uniqueSuits = unique(suits);

    // Set
    if (uniqueValues.length == 1 && uniqueSuits.length == suits.length) {
      return true;
    }

    // Run
    if (uniqueSuits.length == 1 && uniqueValues.length == values.length
    && isConsecutive(values)) {
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

function isConsecutive(array) {
  for (let i = 0; i < array.length-1; i++) {
    if (array[i+1] !== array[i]+1) {
      return false;
    }
  }
  return true;
}
