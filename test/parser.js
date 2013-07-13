var should = require('should');

var Metadata = require('../lib/metadata');
var Parser = require('../lib/parser');

describe('Parser:', function() {
  
  describe('parse prototype file', function() {

    var parser = new Parser();
    var metadata = parser.parseFile(__dirname + '/data/parser-test-1.js');
    
    it('returns a valid file comment', function(){
      metadata.fileComment.should.eql('/**\n * This is the file level comment block\n */\n');
    });
    
    it('returns a valid constructor name', function(){
      metadata.constructor.name.should.eql('ParserTest1');
    });
    
    it('returns a valid constructor type', function(){
      metadata.constructor.type.should.eql(Metadata.CONSTRUCTOR_FUNCTION);
    });

    it('returns a valid constructor line number', function(){
      metadata.constructor.line.should.eql(5);
    });
    
   // it('returns a valid class comment', function() {
   //     metadata.getConstructor().should.eql({ name : 'Sample', comments : '\n * @MyClass(name="this-is-a-name", namespace="my.namespace")\n * @author marc\n */\n' });
   // });
   
   // it('returns valid property comments', function(){
   //   metadata.getProperties().should.eql(
   //     [
   //       {
   //         name: 'myProperty',
   //         comments: ''
   //       }
   //     ]
   //   );
   // });
   
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
   //   );
   // }); 
    
    
    
    
  });
  
});
