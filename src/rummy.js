/**
 * @license
 * Copyright (c) 2016, Patryk Kalinowski
 * Released under the ISC license
 * https://github.com/patrislav/rummy.js/blob/master/LICENSE
 */

import { version } from '../package.json';
import Card from './card';
import Group from './group';
import Board from './board';
import Pile from './pile';
import Player from './player';
import { CardConstants } from './decorators';

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

@CardConstants
export class Rummy {
  static version = version;

  constructor(options) {
    this[_opts] = Object.create(defaultOptions);

    this.Card = Card;
    this.Card.prototype.rummy = this;
    this.Group = Group;
    this.Group.prototype.rummy = this;
    this.Player = Player;
    this.Player.prototype.rummy = this;
    this.Pile = Pile;
    this.Pile.prototype.rummy = this;

    this.board = new Board();
    this.board.rummy = this;

    this.stock = new this.Pile();
    this.discard = new this.Pile();

    if (typeof options == 'object') {
      this.options(options);
    }
  }

  /**
   * @param {string|string[]|object[]} group The group to check
   * @return {boolean} Whether the group is valid
   */
  isValidGroup(group) {
    if (!group) {
      return false;
    }

    return this.createGroup(group).valid;
  }


  createGroup(group) {
    return new this.Group(group);
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

    // Update the reference to this object, otherwise the created objects have
    // a reference to the old object.
    this.Card.prototype.rummy = this;
    this.Group.prototype.rummy = this;
    this.Pile.prototype.rummy = this;
    this.Player.prototype.rummy = this;
  }

}

export { Card };
export default Rummy;
