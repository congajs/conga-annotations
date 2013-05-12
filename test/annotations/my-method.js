var Annotation = require('../../lib/annotation');

var MyMethod = function(data){
  this.value = data['__value'];
  this.someHash = data['someHash'];
};

MyMethod.annotation = 'MyMethod';
MyMethod.targets = [Annotation.METHOD];
MyMethod.prototype.value = null;
MyMethod.prototype.someHash = null;

module.exports = MyMethod;