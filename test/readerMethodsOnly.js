'use strict'

const assert = require('assert')
const Registry = require('../lib/registry')
const Reader = require('../lib/reader')

describe('Reader with only methods:', function() {

  // build the Registry and Reader
  const registry = new Registry()
  const reader = new Reader(registry)
  const samplePath = __dirname + '/data/methodOnlySample.js'

  // register all of our test annotations
  registry.registerAnnotation(__dirname + '/annotations/my-class.js')
  registry.registerAnnotation(__dirname + '/annotations/my-method.js')
  registry.registerAnnotation(__dirname + '/annotations/my-property.js')
  registry.registerAnnotation(__dirname + '/annotations/namespace-property.js')
  registry.registerAnnotation(__dirname + '/annotations/nested.js')

  // parse the sample file
  reader.parse(samplePath)

  // method annotations
  const methodAnnotations = reader.methodAnnotations

  // skipping for now
  // it('first method should exist', function() {
  //   (typeof methodAnnotations[0] !== 'undefined').should.eql(true)
  // })

  // it('first method value should be 1', function() {
  //   methodAnnotations[0].value.should.eql('1')
  // })

  // it('second method should exist', function() {
  //   (typeof methodAnnotations[1] !== 'undefined').should.eql(true)
  // })

  // it('second method value should be 2', function() {
  //   methodAnnotations[1].value.should.eql('2')
  // })

  // it('ES6 method should exist', function() {
  //   (typeof methodAnnotations[2] !== 'undefined').should.eql(true)
  // })

  // it('ES6 method value should be 3', function() {
  //   methodAnnotations[2].value.should.eql('3')
  // })
})
