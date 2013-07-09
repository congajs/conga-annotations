var Annotation = require('../../lib/annotation');

var MyProperty = function(data){
  this.value = data['__value'];
  this.something = data['something'];
  this.foos = data['foos'];
};

MyProperty.annotation = 'MyProperty';
MyProperty.targets = [Annotation.PROPERTY];
MyProperty.prototype.value = null;
MyProperty.prototype.something = null;
MyProperty.prototype.foos = null;

module.exports = MyProperty;