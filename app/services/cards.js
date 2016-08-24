import Ember from 'ember';
import {v1, v4} from 'ember-uuid';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  shoe: Ember.A(),
  discard: Ember.A(),

  numOfDecks: 1,
  numOfShuffle: 2,

  shuffleShoe: true,
  shuffleNewDeck: true,
  cutBeforeShuffle: false,


  start: function() {
    this._super(...arguments);
    
    var numOfDecks = this.get('numOfDecks'),
        numOfShuffle = this.get('numOfShuffle');
       
    for (var i=0; i<numOfDecks; i++) {
      this.addDeck();
    }

  },

  topCard: Ember.computed('shoe.[]', function() {
    return this.get('shoe').get('firstObject');
  }),

  createDeck: function(type) {
    var cards = Ember.A(),
        deckId = v4();

    switch (type) {
      case 'standard':
        cards = this._generateCards();  
        break;

      case 'discard':
      case 'player':
      case 'empty':
      case 'shoe':
      default:
        break;
    }

    return this.get('store').push({
      data: { 
        id: deckId,
        type: 'deck',
        attributes: {
          cards: cards,
          type: type
        }
      }
    });
  },

  createDecks: function(count, type) {
    var decks = [],
        count = typeof count === 'number' ? count: 1;

    for (var i=0; i<count; i++) {
      decks.push(this.createDeck(type));
    };

    return decks;
  },

  _generateCards: function() {
    var cards = Ember.A(),
        special = ['J', 'Q', 'K', 'A'],
        valString = ['two','three','four','five','six','seven','eight','nine','ten','jack', 'queen', 'king', 'ace'],
        suits = ['♠', '♣', '♦', '♥'],
        suitsString = ['club', 'spade', 'diamond', 'heart'],
        batchId = v4();


    for (var j=0; j<suits.length; j++) {
      for (var i=2; i<15; i++) {
        var card = {
          id: v4(),
          type: 'card',
          attributes: {
            name: ((i>10) ? special[i-11] : i) + " " + suits[j],
            value: (i>10) ? special[i-11] : i,
            rank: valString[i-2],
            suitChar: suits[j],
            suit: suitsString[j],
            suitId: j,
            cardNum: i,
            batchId: batchId,
            color: (j>1) ? "redCard" : "blackCard",
          }
        };
        cards.push(card);
      }
    }

    return cards;
  },

  popTop: function() {
    var discard = this.get('discard'),
        shoe = this.get('shoe');

    if (Ember.isPresent(shoe)) {
      discard.insertAt(0, shoe.objectAt(0));
      shoe.removeAt(0);
    }
  },

  shuffleShoe: function(count) {
    var shoe = this.get('shoe'),
        length = shoe.get('length'),
        halfish, left, right, shuffled;

    for (var i=0; i < count; i++) {
      if (this.get('cutBeforeShuffle')) {
        shoe = this._cutCards(shoe, this._randHalf(length));
      }

      halfish = this._randHalf(length);
      left = shoe.slice(0, halfish);
      right = shoe.slice(halfish, length);
      shuffled = [];

      do {
        if (left.get('length') && this._randDo()) {
          shuffled.push(left.pop());
        }
        if (right.get('length') && this._randDo()) {
          shuffled.push(right.pop());
        }
      } while (left.get('length') || right.get('length'));

      this.set('shoe', shuffled);
    }
  },

  shuffle: function(cards, count) {
    var self = this;
    var halfish, left, right, shuffled,
        length = cards.get('length');

    return new Ember.RSVP.Promise(function(resolve) {
      if (self._randDo() || self.get('cutBeforeShuffle')) {
        cards = self._cutCards(cards, self._randHalf(length));
      }

      halfish = self._randHalf(length),
      left = cards.slice(0, halfish);
      right = cards.slice(halfish, length);
      shuffled = [];

      do {
        if (left.get('length') && self._randDo()) {
          shuffled.push(left.pop());
        }
        if (right.get('length') && self._randDo()) {
          shuffled.push(right.pop());
        }
      } while (left.get('length') || right.get('length'));

      if (count > 1) {
        count = count-1;
        resolve(self.shuffle(shuffled, count));
      }
      else {
        resolve({data:shuffled});
      }
    }, '[service][cards]:[shuffle]');
  },

  cutCardsInDeck: function(count) {
    var cut = this.get('cards'),
        total = cut.get('length'),
        _top, _bottom, depth;

    if (!count) {
      return;
    }

    do {
      depth = Math.floor(Math.random() * (total - 1)) + 1;
      cut = this.cutCards(depth, cut);

      count --;
    } while (count);
  },

  _cutCards: function(cards, depth) {
    var cutCards = Ember.A(),
        depth = (typeof depth === 'number') ? depth : 1,
        a,b;

    a = cards.slice(0, depth);
    b = cards.slice(depth, cards.get('length'));

    cutCards.pushObjects(b);
    cutCards.pushObjects(a);

    return cutCards;
  },

  _randHalf: function(max) {
    var sign = this._randDo() ? 1 : -1,
        half = Math.floor(max / 2),
        ish;

    ish = Math.floor(Math.random() * (half / 4)) * sign;

    return half + ish;
  },

  _randIntSigned: function(max, min) {
    var sign = Math.floor(Math.random() * 2) ? 1 : -1;

    return (Math.floor(Math.random() * (max - min)) + min) * sign;
  },

  _randInt: function() {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  // Random true/false for doing an action
  _randDo: function() {
    return Math.floor(Math.random() * 2) ? true : false;
  },

  emptyDecks: function() {
    this.get('shoe').clear();
    this.get('discard').clear();
  },

  empty: function(type) {
    this.get(type).clear();
  },

});
