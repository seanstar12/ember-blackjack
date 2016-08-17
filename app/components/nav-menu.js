import Ember from 'ember';

export default Ember.Component.extend({
  cards: Ember.inject.service(),

  classNames: ['nav-menu', 'primary'],
  tagName: "ul",

  actions: {
    makeDecks(numOfDecks) {
      this.get('cards').start();
    },
    addDeck() {
      this.get('cards').addDeck();
    },

    empty(type) {
      this.get('cards').empty(type);
    },
    emptyDecks() {
      this.get('cards').emptyDecks();
    },
    emptyDiscard() {
      this.get('cards').emptyDiscard();
    },

    shuffle() {
      this.get('cards').shuffleShoe(1);
    },
    pop() {
      this.get('cards').popTop();
    },
  },

});
