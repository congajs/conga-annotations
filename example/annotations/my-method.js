'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class MyMethod extends Annotation {
  /**
   * The target types
   *
   * @type {Array}
   */
  static get targets() {
    return [Annotation.METHOD]
  }
}
