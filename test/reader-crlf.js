'use strict'

const assert = require('assert')
const Registry = require('../lib/registry')
const Reader = require('../lib/reader')
const MyClass = require('./annotations/my-constructor')
const MyMethod = require('./annotations/my-method')
const MyProperty = require('./annotations/my-property')
const NamespaceProperty = require('./annotations/namespace-property')

describe('Reader with CRLF line endings:', () => {

  // build the Registry and Reader
  const registry = new Registry()
  const reader = new Reader(registry)
  const samplePath = __dirname + '/data/sample-crlf.js'

  // register all of our test annotations
  registry.registerAnnotation(__dirname + '/annotations/my-constructor.js')
  registry.registerAnnotation(__dirname + '/annotations/my-method.js')
  registry.registerAnnotation(__dirname + '/annotations/my-property.js')
  registry.registerAnnotation(__dirname + '/annotations/namespace-property.js')
  registry.registerAnnotation(__dirname + '/annotations/nested.js')

  // parse the sample file
  reader.parse(samplePath, Reader.ES5)

  // constructor annotations
  describe('getConstructor()', () => {

    const constructorAnnotations = reader.constructorAnnotations

    it('returns a valid annotation', () => {
      assert(constructorAnnotations[0] instanceof MyClass)
    })

    it('has a correct annotation name', () => {
      assert.equal(constructorAnnotations[0].constructor.name, 'MyConstructor')
    })

    it('has a correct target', () => {
      assert.equal(constructorAnnotations[0].target, 'Sample')
    })

    it('has correct values', () => {
      assert.equal(constructorAnnotations[0].name, 'this-is-a-name')
    })
  })

  // method annotations
  describe('getMethodAnnotations()', () => {

    const methodAnnotations = reader.methodAnnotations

    it('returns a valid annotation', () => {
      assert(methodAnnotations[0] instanceof MyMethod)
    })

    it('has a correct annotation name', () => {
      assert.equal(methodAnnotations[0].constructor.name, 'MyMethod')
    })

    it('has a correct target', () => {
      assert.equal(methodAnnotations[0].target, 'myMethod')
    })

    it('has correct value', () => {
      assert.equal(methodAnnotations[0].value, 'the-value')
    })

    it('has correct single hash value', () => {
      assert.deepEqual(methodAnnotations[0].singleHash, {'foo': true})
    })

    it('has correct hash value', () => {
      assert.deepEqual(methodAnnotations[0].someHash, {'foo': 'bar', 'another': 'one'})
    })

    it('has correct array value', () => {
      assert.deepEqual(methodAnnotations[0].anArray, ['one', 'two', 'three'])
    })

    it('has correct multi-line annotation', () => {
      assert(methodAnnotations[1] instanceof MyMethod)
    })

    it('has correct single hash value (multi-line)', () => {
      assert.deepEqual(methodAnnotations[1].singleHash, {'foo': true})
    })

    it('has correct target without parenthesis', () => {
      assert.equal(methodAnnotations[2].target, 'methodWithoutParenthesis')
    })

    it('has correct target following non-parenthesis', () => {
      assert.equal(methodAnnotations[3].value, 'second annotation')
      assert.deepEqual(methodAnnotations[4].someHash, {foo: 123})
    })

    it('has correct nested annotations', () => {

      assert.equal(methodAnnotations[5].foo.constructor.name, 'Nested')
      assert.equal(methodAnnotations[5].bar.constructor.name, 'Nested')

      assert.equal(methodAnnotations[5].foo.value, 'nested value 1')
      assert.equal(methodAnnotations[5].bar.value, 'nested value 2')

      assert.deepEqual(methodAnnotations[5].bar.anObject, {foo: 'bar'})
    })

    it('has correct array of nested annotations for values', () => {

      assert.equal(methodAnnotations[6].foo.length, 2)
      assert.equal(methodAnnotations[6].foo[0].constructor.name, 'Nested')
      assert.equal(methodAnnotations[6].foo[1].constructor.name, 'Nested')

      assert.equal(methodAnnotations[6].foo[0].value, 'nested 1')
      assert.equal(methodAnnotations[6].foo[1].value, 'nested 2')

    })

    it('has correct array of nested annotations for value', () => {

      assert.equal(methodAnnotations[7].value.length, 2)
      assert.equal(methodAnnotations[7].value.length, 2)

      assert.equal(methodAnnotations[7].value[0].value, 'nested 1')
      assert.equal(methodAnnotations[7].value[1].value, 'nested 2')
    })

  })

  // property annotations
  describe('getPropertyAnnotations', () => {

    const propertyAnnotations = reader.propertyAnnotations

    it('returns a valid property', () => {
      assert(propertyAnnotations[0] instanceof MyProperty)
    })

    it('has a correct annotation name', () => {
      assert.equal(propertyAnnotations[0].constructor.name, 'MyProperty')
    })

    it('returns a valid value', () => {
      assert.equal(propertyAnnotations[0].value, 'my value')
    })

    it('returns a valid namespace property', () => {
      assert(propertyAnnotations[1] instanceof NamespaceProperty)
    })

    it('has a correct namespaced annotation name', () => {
      assert.equal(propertyAnnotations[1].value, 'test')
    })

  })
})
