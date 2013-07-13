var should = require('should');
var AttributeParser = require('../lib/attribute-parser');

describe('AttributeParser:', function() {

	var comment = "*\n *    \"this is a value\",\n * aString=\"foo bar\",\n * " +
				  "   aNumericArray=[1,2,3,4], anObject={foo:\"bar\"}, aStringArray=[\"one\",\"two\"]";

	var parser = new AttributeParser();
	var attributes = parser.parse(comment);

	it('returns a correct __value', function(){
		attributes.__value.should.eql('this is a value');
	});

	it('returns a correct string value', function(){
		attributes.aString.should.eql('foo bar');
	});

	it('returns a correct numeric array', function(){
		attributes.aNumericArray.should.eql([1,2,3,4]);
	});

	it('returns a correct object', function(){
		attributes.anObject.should.eql({ foo : 'bar' });
	});

	it('returns a correct string array', function(){
		attributes.aStringArray.should.eql(['one', 'two']);
	});
});