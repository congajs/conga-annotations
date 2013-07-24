var should = require('should');
var AttributeParser = require('../lib/attribute-parser');
var Registry = require('../lib/registry');
var Reader = require('../lib/reader');
var MyClass = require('./annotations/my-class');
var MyMethod = require('./annotations/my-method');
var MyProperty = require('./annotations/my-property');
var NamespaceProperty = require('./annotations/namespace-property');

var registry = new Registry();
var reader = new Reader(registry);


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
	registry.registerAnnotation(__dirname + '/annotations/nested.js');

	// parse the sample file
	reader.parse(samplePath);
	
	// constructor annotations
	describe('getConstructor()', function() {

		var constructorAnnotations = reader.getConstructorAnnotations();

		it('returns a valid annotation', function() {
			constructorAnnotations[0].should.be.an.instanceof(MyClass);
		});

		it('has a correct annotation name', function() {
			constructorAnnotations[0].annotation.should.eql('MyClass');
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

		it('has a correct annotation name', function() {
			methodAnnotations[0].annotation.should.eql('MyMethod');
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

		it('has correct target following non-parenthesis', function() {
			methodAnnotations[3].value.should.eql('second annotation');
			methodAnnotations[4].someHash.should.eql({ foo : 123 });
		});

		it('has correct nested annotations', function() {

			methodAnnotations[5].foo.annotation.should.eql('Nested');
			methodAnnotations[5].bar.annotation.should.eql('Nested');

			methodAnnotations[5].foo.value.should.eql('nested value 1');
			methodAnnotations[5].bar.value.should.eql('nested value 2');

			methodAnnotations[5].bar.anObject.should.eql({ foo : "bar" });			
		});

		it('has correct array of nested annotations for values', function() {

			methodAnnotations[6].foo.length.should.eql(2);
			methodAnnotations[6].foo[0].annotation.should.eql('Nested');
			methodAnnotations[6].foo[1].annotation.should.eql('Nested');

			methodAnnotations[6].foo[0].value.should.eql('nested 1');
			methodAnnotations[6].foo[1].value.should.eql('nested 2');

		});

		it('has correct array of nested annotations for value', function() {

			methodAnnotations[7].value.length.should.eql(2);
			methodAnnotations[7].value.length.should.eql(2);

			methodAnnotations[7].value[0].value.should.eql('nested 1');
			methodAnnotations[7].value[1].value.should.eql('nested 2');
		});

	});

	// property annotations
	describe('getPropertyAnnotations', function() {

		var propertyAnnotations = reader.getPropertyAnnotations();

		it('returns a valid property', function() {
			propertyAnnotations[0].should.be.an.instanceOf(MyProperty);
		});

		it('has a correct annotation name', function() {
			propertyAnnotations[0].annotation.should.eql('MyProperty');
		});

		it('returns a valid value', function() {
			propertyAnnotations[0].value.should.eql('my value');
		});

		it('returns a valid namespace property', function() {
			propertyAnnotations[1].should.be.an.instanceOf(NamespaceProperty);
		});

		it('has a correct namespaced annotation name', function() {
			propertyAnnotations[1].annotation.should.eql('Namespace:Property');
		});

	});
	
});