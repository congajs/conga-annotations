'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class MyConstructor extends Annotation {
  /**
   * Annotation to parse
   *
   * @type {*}
   */
  static get targets() {
    return [Annotation.CONSTRUCTOR]
  }

}
