var Annotation = require('../../lib/annotation');

var NamespaceProperty = function(data){
  this.value = data['__value'];

};

NamespaceProperty.annotation = 'Namespace:Property';
NamespaceProperty.targets = [Annotation.PROPERTY];
NamespaceProperty.prototype.value = null;

module.exports = NamespaceProperty;