var should = require('should');
var Registry = require('../lib/registry');
var Reader = require('../lib/reader');
var MyClass = require('./annotations/my-class');
var MyMethod = require('./annotations/my-method');
var MyProperty = require('./annotations/my-property');
var NamespaceProperty = require('./annotations/namespace-property');

describe('Reader:', function() {
  
  // build the Registry and Reader
  var registry = new Registry();
  var reader = new Reader(registry);
  var samplePath = __dirname + '/data/sample.js';
  
  // register all of our test annotations
  registry.registerAnnotation(__dirname + '/annotations/my-class.js');
  registry.registerAnnotation(__dirname + '/annotations/my-method.js');
  registry.registerAnnotation(__dirname + '/annotations/my-property.js');
  registry.registerAnnotation(__dirname + '/annotations/namespace-property.js');
  
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

    it('returns a valid annotation', function(){
      methodAnnotations[0].should.be.an.instanceof(MyMethod);
    });
    
    it('has a correct target', function() {
      methodAnnotations[0].target.should.eql('myMethod');
    });

    it('has correct value', function() {
      methodAnnotations[0].value.should.eql('the-value');
    });
    
    it('has correct single hash value', function() {
      methodAnnotations[0].singleHash.should.eql({ "foo" : true });
    });

    it('has correct hash value', function() {
      methodAnnotations[0].someHash.should.eql({ "foo" : "bar", "another" : "one" });
    });

    it('has correct array value', function() {
      methodAnnotations[0].anArray.should.eql(['one', 'two', 'three']);
    });

    it('has correct multi-line annotation', function() {
      methodAnnotations[1].should.be.an.instanceof(MyMethod);
    });

    it('has correct single hash value (multi-line)', function() {
      methodAnnotations[1].singleHash.should.eql({ "foo" : true });
    });

    it('has correct target without parenthesis', function() {
      methodAnnotations[2].target.should.eql('methodWithoutParenthesis');
    });
  });

  // property annotations
  describe('getPropertyAnnotations', function() {

    var propertyAnnotations = reader.getPropertyAnnotations();

    it('returns a valid property', function(){
      propertyAnnotations[0].should.be.an.instanceOf(MyProperty);
    });

    it('returns a valid namespace property', function(){
      propertyAnnotations[1].should.be.an.instanceOf(NamespaceProperty);
    });

  });
  
});