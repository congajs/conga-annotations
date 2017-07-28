'use strict'

const vm = require('vm')

/**
 * The AttributeParser handles parsing out attributes
 * from a given string
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class AttributeParser {

  constructor(globalContext) {
    /**
     * Array of patterns to use in the tokenize method
     *
     * @var {Array}
     */
    this.patterns = [
      /^\s+/, // whitespace
      /^[^\s]+/ // word
    ]

    this.globalContext = globalContext || {}
  }

  /**
   * Convert a string of annotation attributes into
   * a hash of actual javascript values
   *
   * @param  {String} string
   * @return {Object}
   */
  parse(reader, annotationsToFind, string) {

    const tokens = this.tokenize(string)
    let fixedString = ''

    if (string.indexOf('\n') == -1) {
      fixedString = string
    }
    else {
      // clean up comment asterisks and line breaks
      tokens.forEach(function(token) {
        if (token.trim('') !== '*') {
          fixedString += token.replace('\n', '')
        }
      })
    }

    // split all commas
    const parts = fixedString.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

    let isContinue = true
    let i = parts.length - 1

    const fixed = []

    while (isContinue) {

      let part = parts[i]

      let isArray = false
      let isObject = false
      let isAnnotation = false

      // check for annotation, array, or object close
      if (part.trim().substr(part.trim().length - 1) === ')' && !part.trim().match(/(.*)=@\(/)) {
        isAnnotation = true
      }
      else if (part.trim()[part.trim().length - 1] === ']' && !part.trim().match(/(.*)=\[/)) {
        isArray = true
      }
      else if (part.trim()[part.trim().length - 1] === '}' && !part.trim().match(/(.*)=\{/)) {
        isObject = true
      }

      // if this is an annotation, array, or object, combine original string until
      // the start of the target type
      if (isArray || isObject || isAnnotation) {

        let temp = part
        let found = false

        // re-combine array into one piece
        while (!found) {

          i--

          if (i < 0) {
            break
          }

          part = parts[i]

          temp = part + ',' + temp

          if ((isArray && part.trim().match(/(.*)=\[/)) ||
            (isObject && part.trim().match(/(.*)=\{/)) ||
            (isAnnotation && part.trim().match(/(.*)=@(.*)\(/))) {

            found = true
          }
        }

        fixed.unshift(temp)

      }
      else {
        fixed.unshift(part)
      }

      i--

      if (i < 0) {
        isContinue = false
      }
    }

    const args = {}
    i = 0

    fixed.forEach(function(token) {

      let arg
      let value

      // check for single values (no key=value)
      if (i == 0 && token.trim().indexOf('=') === -1) {
        arg = 'value'
        value = token.trim()
      }
      else {

        // split token on first equals, while maintaining the rest of the string
        const split = token.split(/=/)
        arg = split.shift().replace(/\"/g, '')
        value = split.join('=').trim()
      }

      let v
        // check for nested annotation
      if (value.substr(0, 1) === '@') {

        // parse out annotation
        v = reader.parseAttributeAnnotations(annotationsToFind, value)[0]

      }
      else {

        // check for array of annotations
        // @todo - this probably won't work too well if there is whitespace
        if (value.substr(0, 2) === '[@') {

          v = reader.parseAttributeAnnotations(annotationsToFind, value.substr(1, value.length - 2))

        }
        else {

          // run code in context
          const sandbox = this.globalContext
          sandbox.v = null
          vm.createContext(sandbox)
          vm.runInContext('v = ' + value, sandbox)

          v = sandbox.v
        }
      }

      args[arg.trim()] = v
      i++

    }, this)

    return args
  }

  /**
   * Tokenize a string into each of it's parts
   *
   * @param {String} src
   * @returns {Array}
   */
  tokenize(src) {

    let source = src
    const tokens = []
    const regexQueue = []

    const fpattern = function(re) {
      regexQueue.push(function() {
        let ret = false
        const result = re.exec(source)
        if (result) {
          tokens.push(result[0])
          source = source.substring(result[0].length)
          ret = true
        }
        return ret
      })
    }

    for (const i in this.patterns) {
      const re = this.patterns[i]
      fpattern(re)
    }

    while (source) {
      regexQueue.some(function(element, index, array) {
        return element()
      })
    }
    return tokens
  }
}
