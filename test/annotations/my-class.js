var Annotation = require('../../lib/annotation');

var MyClass = function(data){
  this.name = data.name;
};

MyClass.annotation = 'MyClass';
MyClass.targets = [Annotation.CONSTRUCTOR];
MyClass.prototype.name = null;

module.exports = MyClass;