'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class Nested extends Annotation {

  static get targets() {
    return [Annotation.METHOD]
  }
}
