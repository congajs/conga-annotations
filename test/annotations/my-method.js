var Annotation = require('../../lib/annotation');

var MyMethod = function(data){
  this.value = data['__value'];
  this.singleHash = data['singleHash'];
  this.someHash = data['someHash'];
  this.anArray = data['anArray'];
};

MyMethod.annotation = 'MyMethod';
MyMethod.targets = [Annotation.METHOD];
MyMethod.prototype.value = null;
MyMethod.prototype.singleHash = null;
MyMethod.prototype.someHash = null;
MyMethod.prototype.anArray = null;

module.exports = MyMethod;