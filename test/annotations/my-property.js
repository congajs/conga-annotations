var Annotation = require('../../lib/annotation');

var MyProperty = function(data){
  this.value = data['__value'];
  this.something = data['something'];
  this.foos = data['foos'];
};

MyMethod.annotation = 'MyProperty';
MyMethod.targets = [Annotation.PROPERTY];
MyMethod.prototype.value = null;
MyMethod.prototype.something = null;
MyMethod.prototype.foos = null;

module.exports = MyProperty;