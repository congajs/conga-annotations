'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class MyClass extends Annotation {

  /**
   * The target types
   *
   * @type {Array}
   */
  static get targets() {
    return [Annotation.DEFINITION]
  }

}
