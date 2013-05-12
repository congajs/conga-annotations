/**
 * @MyClass(name="this-is-a-name", namespace="my.namespace")
 * @author marc
 */
var Sample = {
  
    /**
     * @MyProperty("the-value", something="hello", foos=["one", "two", "three"])
     * @var {String}
     */
    myProperty: "hello",
    
    /**
     * @MyMethod("the-value", someHash={foo:"bar"})
     * @MyOtherMethod("something")
     */
    myMethod: function(){
      
    },
    
    /**
     * @Blah
     */
    anotherMethod: function(){
      
    }
    
};

module.exports = Sample;