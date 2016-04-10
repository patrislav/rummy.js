/**
 * @license
 * Copyright (c) 2016, Patryk Kalinowski
 * Released under the ISC license
 * https://github.com/patrislav/rummy.js/blob/master/LICENSE
 */

import { version } from '../package.json';
import Card from './card';

const _opts = Symbol('opts');
const defaultOptions = {
  jokers: true,
  jokerPoints: 50,
  acePosition: 'both', // both | low | high
  aceInSetPoints: 11,
  ranks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
  rankSymbols: {'A': 1, 'J': 11, 'Q': 12, 'K': 13},
  suitSymbols: ['s', 'h', 'd', 'c']
};

export class Rummy {
  static version = version;

  static Card = Card;

  constructor(options) {
    this[_opts] = Object.create(defaultOptions);

    if (typeof options == 'object') {
      this.options(options);
    }
  }

  /**
   * @param {string|string[]|object[]} group The group to check
   * @return {boolean} Whether the group is valid
   */
  isValidGroup(group) {
    if (group == undefined) {
      return false;
    }

    group = this.normaliseGroup(group);
    if (!group) {
      return false;
    }

    if (group.length < 3) {
      return false;
    }

    for (let card of group) {
      if (this.options('jokers') && typeof card.joker == 'number') {
        card.rank = 'joker';
        card.suit = 'joker';
      }
      else {
        if (typeof card.suit != 'number' || card.suit < 0 || card.suit > 3) {
          return false;
        }

        if (typeof card.rank != 'number' || card.rank < 1 || card.rank > 13) {
          return false;
        }
      }
    }

    let ranks = group.map(card => card.rank),
      ranksWithoutJokers = ranks.filter(x => x != 'joker'),
      uniqueValues = unique(ranksWithoutJokers),
      jokerCount = ranks.reduce((total, x) => (x == 'joker' ? total+1 : total), 0);

    let suits = group.map(card => card.suit),
      suitsWithoutJokers = suits.filter(x => x != 'joker'),
      uniqueSuits = unique(suitsWithoutJokers, this.options('jokers'));

    if ((ranks.length == 3 && jokerCount > 1)
    || ( ranks.length == 4 && jokerCount > 2)) {
      return false;
    }

    // Set
    if (uniqueValues.length == 1 && uniqueSuits.length == suitsWithoutJokers.length) {
      return true;
    }

    // If there is an ace
    let aceIndex = ranksWithoutJokers.indexOf(1);
    if (aceIndex && this.options('acePosition') === 'both') {
      if (ranks.indexOf(13) || (jokerCount > 0 && ranks.indexOf(12))) {
        ranksWithoutJokers[aceIndex] = 14;
      }
      else if (!ranks.indexOf(2) && !(jokerCount > 0 && ranks.indexOf(3))) {
        return false;
      }
    }
    else if (aceIndex && this.options('acePosition') === 'high') {
      ranksWithoutJokers[aceIndex] = 14;
    }

    // Run
    if (uniqueSuits.length == 1 && uniqueValues.length == ranksWithoutJokers.length
    && isConsecutive(ranksWithoutJokers, jokerCount)) {
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

  /**
   * @param {string|string[]|object[]} group The group to normalise
   * @return {object[]} The normalised group
   */
  normaliseGroup(group) {
    if (typeof group == 'string') {
      group = group.trim().replace(/(\s+)/g, ' ').split(' ');
    }

    if (Object.prototype.toString.call(group) != '[object Array]') {
      return false;
    }

    let newGroup = group.map((card) => {
      if (typeof card == 'object'
      && (('joker' in card) || (('suit' in card) && ('rank' in card)))) {
        return card;
      }

      if (typeof card == 'string') {
        return this.parseCardCode(card);
      }
    })
    .filter(x => x != undefined);

    // If newGroups contains a false value
    if (!newGroup.reduce((prev, curr) => (!prev || !curr ? false : true), true)) {
      return false;
    }

    return newGroup;
  }

  /**
   * @param {string} code The code to parse
   * @return {object} The resulting card object
   */
  parseCardCode(code) {
    if (typeof code != 'string') {
      return false;
    }

    const ranks = this.options('ranks'),
      rankSymbols = this.options('rankSymbols'),
      rankCodes = ranks.concat(Object.keys(rankSymbols)),
      suitSymbols = this.options('suitSymbols'),
      regex = new RegExp(`(${rankCodes.join('|')})(${suitSymbols.join('|')})`, 'g');

    if (code === 'X') {
      return { joker: 1 };
    }

    const match = regex.exec(code);

    if (!match) {
      return false;
    }

    let rank = ((match[1] in rankSymbols) ? rankSymbols[match[1]] : parseInt(match[1])),
      suit = suitSymbols.indexOf(match[2]);

    return { rank, suit };
  }
}

export { Card };
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
