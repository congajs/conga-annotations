'use strict'

/**
 * This class holds the meta data information for
 * a parsed Javascript file.
 *
 * This contains the constructor, methods, properties
 * and associated comment blocks for each.
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class Metadata {
  /**
   * Function constructor type
   *
   * I.E.:
   *
   * function MyClass(){};
   */
  static get CONSTRUCTOR_FUNCTION() {
    return 1
  }

  /**
   * Variable assigned constructor type
   *
   * I.E.:
   *
   * var MyClass = function(){};
   */
  static get CONSTRUCTOR_VARIABLE_FUNCTION() {
    return 2
  }

  /**
   * Object literal constructor type
   *
   * I.E.:
   *
   * var MyClass = { ... };
   */
  static get CONSTRUCTOR_OBJECT_LITERAL() {
    return 3
  }

  constructor() {

    /**
     * The file path to the source file
     *
     * @var {String}
     */
    this.path = null

    /**
     * The constructor type
     *
     * @var {Number}
     */
    this.constructorType = null

    /**
     * The file level comment block
     *
     * @var {String}
     */
    this.fileComment = null

    /**
     * The constructor information
     *
     * Format:
     *
     * {
     *   name: 'MyClass',
     *   line: 1,
     *   comment: 'the comment block',
     *   arguments: [a,b,c]
     * }
     *
     * @var {Object}
     */
    this.constructor = null

    /**
     * The class definition
     *
     * Format:
     *
     * {
     *   name: 'MyClass',
     *   line: 1,
     *   comment: 'the comment block'
     * }
     *
     * @var {Object}
     */
    this.definition = null

    /**
     * The array of methods
     *
     * Format:
     *
     * [
     *   {
     *     name: 'myMethod',
     *     line: 1,
     *     comment: 'the comment block',
     *     arguments: [a,b,c]
     *   }
     * ]
     *
     * @var {Array}
     */
    this.methods = []

    /**
     * The array of properties
     *
     * Format:
     *
     * [
     *   {
	   *     name: 'myProperty',
	   *     line: 1,
	   *     comment: 'the comment block',
	   *     body: 'my default value'
	   *   }
     * ]
     *
     * @var {Array}
     */
    this.properties = []
  }

  /**
   * Set the constructor name and comments
   *
   * @param {String} name
   * @param {String} comments
   */
  setConstructor(name, comments) {
    this.constructor = {
      name: name,
      comments: comments
    }
  }

  /**
   * Add a property name and comments
   *
   * @param {String} name
   * @param {String} comments
   */
  addProperty(name, comments) {
    this.properties.push({
      name: name,
      comments: comments
    })
  }

  /**
   * Add a method name and comments
   *
   * @param {String} name
   * @param {Comments} comments
   */
  addMethod(name, comments) {
    this.methods.push({
      name: name,
      comments: comments
    })
  }
}
