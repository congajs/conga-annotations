'use strict'
const Annotation = require('../../lib/annotation')

module.exports = class NamespaceProperty extends Annotation {
  static get targets() {
    return [Annotation.PROPERTY]
  }

  static get annotation() {
    return 'Namespace:Property'
  }
}
