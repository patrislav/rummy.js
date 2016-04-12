
export function CardConstants(target) {
  let properties = {
    SPADES: 0,
    HEARTS: 1,
    DIAMONDS: 2,
    CLUBS: 3,

    ACE: 1,
    JACK: 11,
    QUEEN: 12,
    KING: 13
  };

  for(let name in properties) {
    target[name] = properties[name];
    target.prototype[name] = properties[name];
  }
}
