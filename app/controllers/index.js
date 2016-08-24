import Ember from 'ember';

export default Ember.Controller.extend({
  dealer: Ember.inject.service(),
  cards: Ember.inject.service(),

  init: function() {
    this._super(...arguments);
  },

});
