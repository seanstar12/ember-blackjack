import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  value: attr(),
  rank: attr(),
  suitChar: attr(),
  suit: attr(),
  suitId: attr(),
  cardNum: attr(),
  UUID: attr(),
  deckUUID: attr(),
  color: attr(),

  deck: belongsTo('deck', {'inverse':'cards'})
});
