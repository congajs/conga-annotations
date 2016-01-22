'use strict'

/**
 * @MyClass(name="this-is-a-name", namespace="my.namespace")
 * @author jaumard
 */
module.exports = class Sample {

  /**
   * @MyConstructor(name="this-is-a-name", namespace="my.namespace")
   * @author jaumard
   */
  constructor(){

  }

  /**
   * @MyProperty("my value", something="hello", foos=["one","two","three"])
   * @var {String}
   */
  myProperty = "hello"

  /**
   * @Namespace:Property("test")
   * @type {String}
   */
  namespaceProperty = "namespaced annotation"

  /**
   * @MyMethod("the-value", singleHash={"foo":true}, someHash={foo:"bar", another:"one"}, anArray=["one", "two", "three"])
   * @MyOtherMethod("something")
   */
  myMethod() {

  }

  /**
   * @MyMethod("multi-line value",
   *  singleHash={"foo":true},
   *  someHash={
     *      "here":"is",
     *      "a":"multi",
     *      "line":"hash"
     *
     *  },
   *  anArray=[
   *      "this",
   *      "is",
   *      "in",
   *      "a***",
   *      "multi-",
   *      "line"
   *  ]
   * )
   */
  anotherMethod() {

  }

  /**
   * @MyMethod
   * @MyMethod("second annotation")
   * @MyMethod(someHash={foo:123})
   */
  methodWithoutParenthesis() {

  }

  /**
   * @MyMethod(
   *     "my value",
   *     singleHash={foo:"bar"},
   *     foo=@Nested("nested value 1", anArray=[1,2,3]),
   *     bar=@Nested("nested value 2", anObject={foo:"bar"}, aString="this is a string")
   * )
   */
  methodWithNestedAnnotations() {

  }

  /**
   * @MyMethod(foo=[@Nested("nested 1"), @Nested("nested 2")])
   */
  methodWithNestedAnnotations2() {

  }

  /**
   * @MyMethod([@Nested("nested 1"), @Nested("nested 2")])
   */
  methodWithNestedAnnotationsAsValue() {

  }

};
