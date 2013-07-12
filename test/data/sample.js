/**
 * @MyClass(name="this-is-a-name", namespace="my.namespace")
 * @author marc
 */
var Sample = {
  
    /**
     * @MyProperty("the-value", something="hello", foos=["one","two","three"])
     * @var {String}
     */
    myProperty: "hello",
    
    /**
     * @Namespace:Property("test")
     * @type {String}
     */
    namespaceProperty: "namespaced annotation",

    /**
     * @MyMethod("the-value", singleHash={"foo":true}, someHash={foo:"bar", another:"one"}, anArray=["one", "two", "three"])
     * @MyOtherMethod("something")
     */
    myMethod: function(){
      
    },
    
    /**
     * @MyMethod("multi-line value",
     *  singleHash={"foo":true},
     *  someHash={
     *      "here":"is",
     *      "a":"multi",
     *      "line":"hash"
     *      
     *  }
     *  anArray=[
     *  "this", 
     *  "is", 
     *  "in", 
     *  "a***", 
     *  "multi-", 
     *  "line"
     *  ]
     * )
     */
    anotherMethod: function(){
      
    },

    /**
     * @MyMethod
     */
    methodWithoutParenthesis: function(){

    }
    
};

module.exports = Sample;