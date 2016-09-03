'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class MyProperty extends Annotation {
  static get targets() {
    return [Annotation.PROPERTY]
  }
}
