import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  type: attr(),
  position: attr(),
  name: Ember.computed('id', function() {
    var id = this.get('id');

    if (id === '0') return "Dealer"; 
    return "Player: " + this.get('id');
  }),

  //@TODO: multi deck support for splits
  deck: belongsTo('deck', {inverse:'player', async: false}),
});
