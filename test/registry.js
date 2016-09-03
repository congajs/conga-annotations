'use strict'

const assert = require('assert')
const Registry = require('../lib/registry')

// test files
const MyClass = require('./annotations/my-class')

describe('Registry:', function () {

  // create an annotation registry and register some annotations
  const registry = new Registry()
  registry.registerAnnotation(__dirname + '/annotations/my-class.js')

  describe('a registered annotation', function () {

    const annotations = registry.annotations

    it('should have an annotation property', function () {
      assert(annotations.MyClass)
    })

    it('should have a valid annotation', function () {
      assert.equal(annotations.MyClass, MyClass)
    })
  })

})
