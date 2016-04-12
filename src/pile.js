class Pile {

  constructor(array, options) {
    this.cards = (array && array.slice ? array.slice() : []);

    if (options && options.discard === true) {
      this.discard = true;
    }
  }

  /**
   * Clears the pile
   *
   * @return {Array} Removed elements
   */
  clear() {
    return this.cards.splice(0, this.cards.length);
  }

  /**
   * Shuffles the pile
   *
   * @return {Pile} this
   */
  shuffle() {
    for (let i = this.cards.length-1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i+1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
    return this;
  }

  /**
   * Calls `push()` on the underlying array
   *
   * @param {object} card
   */
  push(card) {
    return this.cards.push(card);
  }

  /**
   * Calls `pop()` on the underlying array
   *
   * @return {object} item
   */
  pop() {
    return this.cards.pop();
  }

  /**
   * The bottom of the pile (the first element of the array)
   */
  get bottom() {
    return this.cards[0];
  }

  /**
   * The top of the pile (the last element of the array)
   */
  get top() {
    return this.cards[this.cards.length-1];
  }

}

export default Pile;
