var should = require('should');
var Registry = require('../lib/registry');

// test files
var MyClass = require('./annotations/my-class');

describe('Registry:', function() {
  
  // create an annotation registry and register some annotations
  var registry = new Registry();
  registry.registerAnnotation(__dirname + '/annotations/my-class.js');
  
  describe('a registered annotation', function() {

    var annotations = registry.getAnnotations();
    
    it('should have an annotation property', function() {
      annotations.should.have.property('MyClass');
    });

    it('should have a valid annotation', function() {
      annotations.MyClass.should.eql(MyClass);
    });
  });
  
});