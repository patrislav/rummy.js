
class Board {
  constructor() {
    this.groups = new Array();
  }

  get cards() {
    let _cards = [];
    for(let group of this.groups) {
      for(let card of group.cards) {
        _cards.push(card);
      }
    }
    return _cards;
  }

  add(item) {
    if (item == undefined) {
      return false;
    }

    let group;
    if (typeof item == 'string') {
      group = new this.rummy.Group(item);
    }
    else {
      group = item;
    }

    if (group.valid) {
      this.groups.push(group);
      return true;
    }

    return false;
  }

  clear() {
    this.groups.splice(0, this.groups.length);
  }
}

export default Board;
