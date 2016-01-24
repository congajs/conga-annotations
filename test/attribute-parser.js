'use strict'

const assert = require('assert')
const AttributeParser = require('../lib/attribute-parser')

describe('AttributeParser:', function () {

  const comment = '*\n *    "this is a value",\n * aString="foo bar",\n * ' +
    '   aNumericArray=[1,2,3,4], anObject={foo:"bar"}, aStringArray=["one","two"]'

  const parser = new AttributeParser()
  const attributes = parser.parse(null, null, comment)

  it('returns a correct __value', function () {
    assert.equal(attributes.value, 'this is a value')
  })

  it('returns a correct string value', function () {
    assert.equal(attributes.aString, 'foo bar')
  })

  it('returns a correct numeric array', function () {
    assert.deepEqual(attributes.aNumericArray, [1, 2, 3, 4])
  })

  it('returns a correct object', function () {
    assert.deepEqual(attributes.anObject, {foo: 'bar'})
  })

  it('returns a correct string array', function () {
    assert.deepEqual(attributes.aStringArray, ['one', 'two'])
  })
})
