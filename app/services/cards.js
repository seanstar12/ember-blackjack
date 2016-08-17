import Ember from 'ember';
import {v1, v4} from 'ember-uuid';

export default Ember.Service.extend({
  shoe: Ember.A(),
  discard: Ember.A(),

  numOfDecks: 1,
  numOfShuffle: 1,

  shuffleShoe: true,
  shuffleNewDeck: true,
  cutBeforeShuffle: true,


  start: function() {
    this._super(...arguments);
    
    var numOfDecks = this.get('numOfDecks'),
        numOfShuffle = this.get('numOfShuffle');
       
    for (var i=0; i<numOfDecks; i++) {
      var newDeck = this._createDeck();

      if (this.get('shuffleNewDeck')) {
        newDeck = this._shuffle(newDeck);
      }

      this._addDeckToShoe(newDeck);
    }

    this.shuffleShoe(numOfShuffle);
  },

  addDeck: function() {
    var deck = this._createDeck();

    if (this.get('shuffleNewDeck')) {
      deck = this._shuffle(deck);
    }

    this._addDeckToShoe(deck);
  },

  _createDeck: function() {
    var cards = Ember.A(),
        deckId = v4(),
        special = ['J', 'Q', 'K', 'A'],
        suits = ['♠', '♣', '♦', '♥'];

    for (var j=0; j<suits.length; j++) {
      for (var i=2; i<15; i++) {
        cards.push(Ember.Object.create({
          name: ((i>10) ? special[i-11] : i) + " " + suits[j],
          value: (i>10) ? special[i-11] : i,
          suit: suits[j],
          suitId: j,
          cardNum: i,
          cardId: v4(),
          deckId: deckId,
          color: (j>1) ? "red" : "black",
        }));
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

  _shuffle: function(cards) {
    var halfish, left, right, shuffled,
        length = cards.get('length');

    if (this._randDo() || this.get('cutBeforeShuffle')) {
      cards = this._cutCards(cards, this._randHalf(length));
    }

    halfish = this._randHalf(length),
    left = cards.slice(0, halfish);
    right = cards.slice(halfish, length);
    shuffled = [];

    do {
      if (left.get('length') && this._randDo()) {
        shuffled.push(left.pop());
      }
      if (right.get('length') && this._randDo()) {
        shuffled.push(right.pop());
      }
    } while (left.get('length') || right.get('length'));

    return shuffled;
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

  _addDeckToShoe: function(deck) {
    var shoe = this.get('shoe');

    shoe.pushObjects(deck);
  },

  _cutCards: function(cards, depth) {
    console.log('cutCards');
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
        max = Math.floor(((typeof max === 'number') ? max : 0) /6),
        half = Math.floor(max / 2),
        ish;

    ish = Math.floor(Math.random() * (max)) * sign;

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
