var should = require('should');
var Registry = require('../lib/registry');
var Reader = require('../lib/reader');
var MyClass = require('./annotations/my-class');
var MyMethod = require('./annotations/my-method');

describe('Reader:', function() {
  
  // build the Registry and Reader
  var registry = new Registry();
  var reader = new Reader(registry);
  var samplePath = __dirname + '/data/sample.js';
  
  // register all of our test annotations
  registry.registerAnnotation(__dirname + '/annotations/my-class.js');
  registry.registerAnnotation(__dirname + '/annotations/my-method.js');
  
  // parse the sample file
  reader.parse(samplePath);
  
  // constructor annotations
  describe('getConstructor()', function() {

    var constructorAnnotations = reader.getConstructorAnnotations();
    
    it('returns a valid annotation', function() {
      constructorAnnotations[0].should.be.an.instanceof(MyClass);
    });

    it('has a correct target', function() {
      constructorAnnotations[0].target.should.eql('Sample');
    });
    
    it('has correct values', function() {
      constructorAnnotations[0].name.should.eql('this-is-a-name');
    });
    
  });
  
  // method annotations
  describe('getMethodAnnotations()', function() {
    
    var methodAnnotations = reader.getMethodAnnotations();

    if('returns a valid annotation', function(){
      methodAnnotations[0].should.be.an.instanceof(MyMethod);
    });
    
    it('has a correct target', function() {
      methodAnnotations[0].target.should.eql('myMethod');
    });

    it('has correct value', function() {
      methodAnnotations[0].value.should.eql('the-value');
    });
    
    it('has correct values', function() {
      methodAnnotations[0].someHash.should.eql({ "foo" : "bar" });
    });
  });
  
});