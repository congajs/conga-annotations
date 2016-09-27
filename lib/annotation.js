'use strict'

/**
 * The Annotation class
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class Annotation {
  static get annotation() {
    return null
  }

  /**
   * The target types
   *
   * @type {Array}
   */
  static get targets() {
    return [Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.METHOD, Annotation.PROPERTY, Annotation.ANNOTATION]
  }

  /**
   * Definition annotation type
   *
   * @var {Number}
   */
  static get DEFINITION() {
    return 0
  }

  /**
   * Constructor annotation type
   *
   * @var {Number}
   */
  static get CONSTRUCTOR() {
    return 1
  }

  /**
   * Property annotation type
   *
   * @var {Number}
   */
  static get PROPERTY() {
    return 2
  }

  /**
   * Method annotation type
   *
   * @var {Number}
   */
  static get METHOD() {
    return 3
  }


  /**
   * Nested annotation type
   *
   * @type {Number}
   */
  static get ANNOTATION() {
    return 4
  }

  constructor(data, filePath) {

    /**
     * The main annotation value
     *
     * @type {*}
     */
    this.value = null


    /**
     * The class name of the annotation
     *
     * @type {String}
     */
    this.className = null

    /**
     * The path to the file where this annotation was found
     *
     * @type {String}
     */
    this.filePath = null

    /**
     * The path to the directory the file loading this annotation lives in
     *
     * @type {String}
     */
    this.directoryPath = null

    if (typeof data === 'object') {
      for (const property in data) {
        this[property] = data[property]
      }
    }

    if (filePath) {
      this.filePath = filePath
    }

    // call the init method with given data if it exists
    if (typeof this.init === 'function') {
      this.init(data)
    }
  }

  /**
   * Optional initialization method that
   * can be used to transform data
   *
   * @param  {Object} data
   * @return {void}
   */
  init(data) {

  }

  /**
   * Get the directory from this file path
   *
   * @returns {String|null}
   */
  getDirectory() {
    if (!this.directoryPath) {

      if (!this.filePath || this.filePath.length === 0) {
        return null
      }

      const parts = this.filePath.split('/')
      this.directoryPath = Array.prototype.slice.call(parts, 0, parts.length - 1).join('/')
    }
    return this.directoryPath
  }

  /**
   * File path
   *
   * @type {String}
   */
  static get path() {
    throw Error('path must be overridden in subclass and return __filename')
  }
}

