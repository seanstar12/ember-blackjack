import Ember from 'ember';

export default Ember.Controller.extend({
  cards: Ember.inject.service(),
  players: Ember.inject.service(),

  shoe: Ember.A(),
  discard: null,

  numOfDecks: 1,
  numOfShuffle: 2,
  
  cutBeforeShuffle: true,
  shuffleNewDeck: true,

  init: function() {
    this._super(...arguments);
    this.setupDecks();
  },

  setupDecks() {
    var cards = this.get('cards'),
        shoe = this.get('shoe'),
        discard = this.get('discard'),
        raw;
    
    shoe = cards.createDeck('shoe');
    discard = cards.createDeck('discard');

    raw = cards.createDecks(this.get('numOfDecks'));
    
    raw.forEach(function(deck) {
      var _cards = deck.get('cards');
      shoe.get('cards').pushObjects(_cards);

    });
  },

  

});
