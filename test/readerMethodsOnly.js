var should = require('should');
var AttributeParser = require('../lib/attribute-parser');
var Registry = require('../lib/registry');
var Reader = require('../lib/reader');
var MyClass = require('./annotations/my-class');
var MyMethod = require('./annotations/my-method');
var MyProperty = require('./annotations/my-property');
var NamespaceProperty = require('./annotations/namespace-property');

describe('Reader with only methods:', function() {

    // build the Registry and Reader
    var registry = new Registry();
    var reader = new Reader(registry);
    var samplePath = __dirname + '/data/methodOnlySample.js';

    // register all of our test annotations
    registry.registerAnnotation(__dirname + '/annotations/my-class.js');
    registry.registerAnnotation(__dirname + '/annotations/my-method.js');
    registry.registerAnnotation(__dirname + '/annotations/my-property.js');
    registry.registerAnnotation(__dirname + '/annotations/namespace-property.js');
    registry.registerAnnotation(__dirname + '/annotations/nested.js');

    // parse the sample file
    reader.parse(samplePath);

    // method annotations
    var methodAnnotations = reader.getMethodAnnotations();

    it('first method should exist', function() {
        (typeof methodAnnotations[0] !== "undefined").should.eql(true);
    });

    it('first method value should be 1', function() {
        methodAnnotations[0].value.should.eql("1");
    });

    it('second method should exist', function() {
        (typeof methodAnnotations[1] !== "undefined").should.eql(true);
    });

    it('second method value should be 2', function() {
        methodAnnotations[1].value.should.eql("2");
    });
});