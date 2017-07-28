'use strict'

const assert = require('assert')
const AttributeParser = require('../lib/attribute-parser')

describe('AttributeParser:', function () {

  const comment = '*\n *    "this is a value",\n * aString="foo bar",\n * ' +
    '   aNumericArray=[1,2,3,4], anObject={foo:"bar"}, aStringArray=["one","two"],\n ' +
    ' aStringWithCommas="this,is,a,string,  with   ,   some,   commas"'

  const parser = new AttributeParser()
  const attributes = parser.parse(null, null, comment)

  it('returns a correct __value', function () {
    assert.equal(attributes.value, 'this is a value')
  })

  it('returns a correct string value', function () {
    assert.equal(attributes.aString, 'foo bar')
  })

  if('returns a correct string value containing commas', function () {
    assert.equal(attributes.aStringWithCommas, 'this,is,a,string,  with   ,   some,   commas');
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
