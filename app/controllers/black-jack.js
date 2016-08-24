import Ember from 'ember';

export default Ember.Controller.extend({
  cards: Ember.inject.service(),
  players: Ember.A(),
  playerSort: ['position:desc'],
  playersByPos: Ember.computed.sort('players', 'playerSort'),
  shoe: Ember.A(),

  discard: null,

  numOfDecks: 2,
  numOfShuffle: 7,
  numOfPlayers: 2,
  playerCount: 0,
  
  cutBeforeShuffle: true,
  shuffleNewDeck: true,

  init: function() {
    this._super(...arguments);
    this.setupDeck();
    this.setupPlayers();
    //this.dealCards();
  },

  dealCards() {
    var self = this,
        players = this.get('playersByPos'),
        playersLength = players.get('length'),
        numOfPlayers = this.get('numOfPlayers'),
        i,j;

    for (j=0;j<2;j++){
      for (i=0;i<playersLength;i++){
        this.dealCard(i);
      };
    };

  },

  dealCardOld(player) {
    var self = this;

    Ember.RSVP.Promise.all([
      self.getTopCard(),
      self.getPlayerByPos(player)
    ], '[controllers][bj]:[dealCard]:[player]['+ player + ']')
    .then(function(values) {
      var playerCards = values[1].get('deck.cards');

      playerCards.pushObject(values[0]);
    }, null, '[controllers][bj]:[dealCard]:[then][pushPlayerCard]');
  },

  dealCard(player) {
    var self = this;
    player.get('deck.cards').then(function(cards) {
      self.getTopCard().then(function(topCard) {
        cards.pushObject(topCard);
      });
    });
      
  },

  getPlayerByPos(pos) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve) {
      return resolve(self.get('players').objectAt(pos));
    }, '[controllers][bj]:[getPlayerByPos]');
  },

  getPlayerCards(player) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve) {
      var playerCards = player.get('deck.cards');

      playerCards.then(function(cards) {
        return resolve(cards);
      }, null, '[resolve][player][cards]');
    }, '[controllers][bj]:[getPlayerCards]:[player]: ' + player);
  },

  getTopCard() {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve) {
      self.get('shoe.cards').then(function(cards) {
        return resolve(cards.get('firstObject'));
      }, null, '[resolve][cards][firstObject]');
    }, '[controllers][bj]:[getTopCard]');
  },

  setupPlayers() {
    var self = this,
        cards = this.get('cards'),
        players = this.get('players'),
        numOfPlayers = this.get('numOfPlayers'),
        i;

    players.push(this.get('store').createRecord('player', {
      id: 0,
      position: 0,
      deck: cards.createDeck('player'),
      type: 'dealer'
    }));

    for (i=0;i<numOfPlayers;i++) {
      players.push(this.get('store').createRecord('player', {
        id: this.incrementProperty('playerCount'),
        position: this.get('playerCount'),
        deck: cards.createDeck('player'),
        type: 'standard'
      }));
    }
  },

  setupDeck() {
    var self = this,
        cards = this.get('cards'),
        shoe = this.set('shoe', cards.createDeck('shoe')),
        numOfDecks = this.get('numOfDecks'),
        numOfShuffle = this.get('numOfShuffle'),
        raw = Ember.A(),
        i;
    
    for (i=0;i<numOfDecks;i++) {
      raw.pushObjects(cards._generateCards());
    }

    cards.shuffle(raw, numOfShuffle).then(function(_cards) {
      shoe.set('cards', self.store.push(_cards));
    }, null, '[controllers][bj]:[setupDeck]:[shuffle]');

    this.set('discard', cards.createDeck('discard'));
  },

  actions: {
    giveCard: function(player) {
      this.dealCard(player);
    },
  }
  

});
