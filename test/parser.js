'use strict'

const assert = require('assert')
const Metadata = require('../lib/metadata')
const Parser = require('../lib/parseres5')

describe('Parser:', function() {

  describe('parse prototype file', function() {

    const parser = new Parser()
    const metadata = parser.parseFile(__dirname + '/data/parser-test-1.js')

    it('returns a valid file comment', function(){
      assert.equal(metadata.fileComment, '/**\n * This is the file level comment block\n */\n')
    })

    it('returns a valid constructor name', function(){
      assert.equal(metadata.constructor.name, 'ParserTest1')
    })

    it('returns a valid constructor type', function(){
      assert.equal(metadata.constructor.type, Metadata.CONSTRUCTOR_FUNCTION)
    })

    it('returns a valid constructor line number', function(){
      assert.equal(metadata.constructor.line, 5)
    })

   // it('returns a valid class comment', function() {
   //     metadata.getConstructor().should.eql({ name : 'Sample', comments : '\n * @MyClass(name="this-is-a-name", namespace="my.namespace")\n * @author marc\n */\n' })
   // })

   // it('returns valid property comments', function(){
   //   metadata.getProperties().should.eql(
   //     [
   //       {
   //         name: 'myProperty',
   //         comments: ''
   //       }
   //     ]
   //   )
   // })

   // it('returns valid method comments', function() {
   //   metadata.getMethods().should.eql(
   //       [
   //         { name: 'myMethod',
   //           comments: '\n * @MyClass(name="this-is-a-name", namespace="my.namespace")\n * @author marc\n */\nvar Sample = {\n  \n    /**\n     * @MyProperty("the-value", something="hello", foos=["one", "two", "three"])\n     * @var {String}\n     */\n    myProperty: "hello",\n    \n    /**\n     * @MyMethod("the-value", someHash={foo:"bar"})\n     * @MyOtherMethod("something")\n     */\n'
   //         },
   //         { name: 'anotherMethod',
   //           comments: '\n     * @Blah\n     */\n'
   //         }
   //       ]
   //   )
   // })
  })

})
