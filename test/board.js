import { expect } from 'chai';
import Rummy from '..';

let rummy, groups;

beforeEach(() => {
  rummy = new Rummy();
  groups = [
    new rummy.Group('7d 7h 7c'),
    new rummy.Group('3s 4s 5s 6s')
  ];
});

describe('Board', () => {

  it('exists on the Rummy object', () => {
    expect(rummy.board).to.exist;
  });

  it("has property 'groups' that is an array", () => {
    expect(rummy.board).to.have.property('groups')
      .that.is.an('array');
  });

  describe('.add()', () => {
    describe('with no arguments', () => {
      it('returns false', () => {
        expect(rummy.board.add()).to.be.false;
      });

      it("doesn't change the groups", () => {
        rummy.board.groups = groups;
        rummy.board.add();
        expect(rummy.board.groups).to.deep.equal(groups);
      });
    });

    describe('with a Group object', () => {
      describe("when it's valid", () => {
        it('adds the group', () => {
          const group = new rummy.Group('4d 5d X 7d');
          rummy.board.groups = [];
          rummy.board.add(group);
          expect(rummy.board.groups).to.include(group);
        });
      });

      describe("when it's invalid", () => {
        it("doesn't change the groups array", () => {
          const group = new rummy.Group('5s 6d 7c');
          rummy.board.groups = [];
          expect(() => rummy.board.add(group)).to.not.change(rummy.board, 'groups');
        });
      });
    });

    describe('with a string', () => {
      describe("when it's valid", () => {
        const str = '4d 5d X 7d';

        it('adds an item to the groups array', () => {
          rummy.board.groups = [];
          expect(() => rummy.board.add(str)).to.increase(rummy.board.groups, 'length');
        });

        it('adds the correct Group object', () => {
          rummy.board.groups = [];
          rummy.board.add(str);
          expect(rummy.board.groups[0]).to.be.instanceof(rummy.Group);
          expect(rummy.board.groups[0].toString()).to.equal(str);
        });
      });

      describe("when it's invalid", () => {
        const str = '5s 6d 7c';

        it("doesn't change the groups array", () => {
          rummy.board.groups = [];
          expect(() => rummy.board.add(str)).to.not.change(rummy.board, 'groups');
        });
      });
    });
  });

  describe('.clear()', () => {
    it('clears the groups', () => {
      rummy.board.groups = groups;
      rummy.board.clear();
      expect(rummy.board.groups).to.be.empty;
    });
  });

  describe('.cards', () => {
    it('contains all the cards on the board', () => {
      rummy.board.groups = groups;
      expect(rummy.board.cards).to.have.length(7);
    });
  });

});
