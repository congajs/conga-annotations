'use strict'

const assert = require('assert')
const Registry = require('../lib/registry')
const Reader = require('../lib/reader')
const MyClass = require('./annotations/my-class')
const MyConstructor = require('./annotations/my-constructor')
const MyMethod = require('./annotations/my-method')
const MyProperty = require('./annotations/my-property')
const NamespaceProperty = require('./annotations/namespace-property')

describe('ReaderES6 with CRLF line endings:', function() {

  // build the Registry and Reader
  const registry = new Registry()
  const reader = new Reader(registry, {
    test: 'test'
  })

  const samplePath = __dirname + '/data/sampleES6-crlf.js'

  // register all of our test annotations
  registry.registerAnnotation(__dirname + '/annotations/my-class.js')
  registry.registerAnnotation(__dirname + '/annotations/my-constructor.js')
  registry.registerAnnotation(__dirname + '/annotations/my-method.js')
  registry.registerAnnotation(__dirname + '/annotations/my-property.js')
  registry.registerAnnotation(__dirname + '/annotations/namespace-property.js')
  registry.registerAnnotation(__dirname + '/annotations/nested.js')

  // parse the sample file
  reader.parse(samplePath, Reader.ES6)

  describe('getDefinition()', function() {
    const definitionAnnotations = reader.definitionAnnotations

    it('has a correct target', function() {
      assert.equal(definitionAnnotations[0].target, 'Sample')
    })

    it('returns a valid annotation', function() {
      assert(definitionAnnotations[0] instanceof MyClass)
    })

    it('has correct values', function() {
      assert.equal(definitionAnnotations[0].name, 'this-is-a-name')
    })
  })

  // constructor annotations
  describe('getConstructor()', function() {

    const constructorAnnotations = reader.constructorAnnotations

    it('returns a valid annotation', function() {
      assert(constructorAnnotations[0] instanceof MyConstructor)
    })

    it('has a correct target', function() {
      assert.equal(constructorAnnotations[0].target, 'constructor')
    })

    it('has correct values', function() {
      assert.equal(constructorAnnotations[0].name, 'this-is-a-name')
    })

  })

  // method annotations
  describe('getMethodAnnotations()', function() {

    const methodAnnotations = reader.methodAnnotations

    it('returns a valid annotation', function() {
      assert(methodAnnotations[0] instanceof MyMethod)
    })

    it('has a correct target', function() {
      assert.equal(methodAnnotations[0].target, 'myMethod')
    })

    it('has correct value', function() {
      assert.equal(methodAnnotations[0].value, 'the-value')
    })

    it('has correct single hash value', function() {
      assert.deepEqual(methodAnnotations[0].singleHash, {
        'foo': true
      })
    })

    it('has correct hash value', function() {
      assert.deepEqual(methodAnnotations[0].someHash, {
        'foo': 'bar',
        'another': 'one'
      })
    })

    it('has correct array value', function() {
      assert.deepEqual(methodAnnotations[0].anArray, ['one', 'two', 'three'])
    })

    it('has correct multi-line annotation', function() {
      assert(methodAnnotations[1] instanceof MyMethod)
    })

    it('has correct single hash value (multi-line)', function() {
      assert.deepEqual(methodAnnotations[1].singleHash, {
        'foo': true
      })
    })

    it('has correct target without parenthesis', function() {
      assert.equal(methodAnnotations[2].target, 'methodWithoutParenthesis')
    })

    it('has correct target following non-parenthesis', function() {
      assert.equal(methodAnnotations[3].value, 'second annotation')
      assert.deepEqual(methodAnnotations[4].someHash, {
        foo: 123
      })
    })

    it('has correct nested annotations', function() {

      assert.equal(methodAnnotations[5].foo.constructor.name, 'Nested')
      assert.equal(methodAnnotations[5].bar.constructor.name, 'Nested')

      assert.equal(methodAnnotations[5].foo.value, 'nested value 1')
      assert.equal(methodAnnotations[5].bar.value, 'nested value 2')

      assert.deepEqual(methodAnnotations[5].bar.anObject, {
        foo: 'bar'
      })
    })

    it('has correct array of nested annotations for values', function() {

      assert.equal(methodAnnotations[6].foo.length, 2)
      assert.equal(methodAnnotations[6].foo[0].constructor.name, 'Nested')
      assert.equal(methodAnnotations[6].foo[1].constructor.name, 'Nested')

      assert.equal(methodAnnotations[6].foo[0].value, 'nested 1')
      assert.equal(methodAnnotations[6].foo[1].value, 'nested 2')

    })

    it('has correct array of nested annotations for value', function() {

      assert.equal(methodAnnotations[7].value.length, 2)
      assert.equal(methodAnnotations[7].value.length, 2)

      assert.equal(methodAnnotations[7].value[0].value, 'nested 1')
      assert.equal(methodAnnotations[7].value[1].value, 'nested 2')
    })

    it('has correct value for global variable', function() {
      assert.equal(methodAnnotations[8].value.global, 'test')
    })
  })

  // property annotations
  describe('getPropertyAnnotations', function() {

    const propertyAnnotations = reader.propertyAnnotations

    it('returns a valid property', function() {
      assert(propertyAnnotations[0] instanceof MyProperty)
    })

    it('has a correct target', function() {
      assert.equal(propertyAnnotations[0].target, 'myProperty')
    })

    it('returns a valid value', function() {
      assert.equal(propertyAnnotations[0].value, 'my value')
    })

    it('returns a valid namespace property', function() {
      assert(propertyAnnotations[1] instanceof NamespaceProperty)
    })

    it('has a correct namespaced target', function() {
      assert.equal(propertyAnnotations[1].target, 'namespaceProperty')
    })

    it('has a correct namespaced annotation name', function() {
      assert.equal(propertyAnnotations[1].value, 'test')
    })
  })
})
