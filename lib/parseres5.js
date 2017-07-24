'use strict'

const fs = require('fs')
const StringScanner = require('StringScanner')

const utils = require('./utils')
const Metadata = require('./metadata')

/**
 * This class parses a given file path and returns
 * a Metadata object with information about the file's
 * constructor, methods, properties, etc...
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class Parser {
  /**
   * foo: function(){}
   */
  static get T_FUNCTION() {
    return /(\w+)(.*): *function\((.*)\)/
  }

  /**
   * foo: "some variable"
   */
  static get T_PROPERTY() {
    return /(\w+)(.*): *(((?!function).)*)\n/
  }

  /**
   * function MyConstructor(){}
   */
  static get T_CONSTRUCTOR_FUNCTION() {
    return /function (.*)\((.*)\)/
  }

  /**
   * var MyConstructor = function(){}
   */
  static get T_CONSTRUCTOR_FUNCTION_VARIABLE() {
    return /var|let|const (.*) = function\((.*)\)/
  }

  /**
   * var MyConstructor = { ... }
   */
  static get T_CONSTRUCTOR_OBJECT_LITERAL() {
    return /var|let|const (.*) = {\n/
  }

  /**
   * MyConstructor.prototype.myMethod = function(){}
   */
  static get T_PROTOTYPE_METHOD() {
    return /(\w+)(.*).prototype.(.*) = function/
  }

  /**
   * MyConstructor.prototype.myProperty = 'foo';
   */
  static get T_PROTOTYPE_PROPERTY() {
    return /P.prototype.(.*) = (.*);/
  }

  /**
   * Parse the Metadata from a given javascript file path
   *
   * @param {String} path
   * @returns {Metadata}
   */
  parseFile(path) {
    const stat = fs.lstatSync(path)
    if (!stat || !stat.isFile()) {
      return null
    }
    const metadata = this.parseSource(fs.readFileSync(path).toString())
    metadata.path = path
    return metadata
  }

  /**
   * Parse the Metadata from a file content string
   *
   * @param {String} source
   * @returns {Metadata}
   */
  parseSource(source) {

    // normalize line breaks to fix issues with CRLF
    source = source.replace(/\r/gm,'');

    const metadata = new Metadata()
    const ss = new StringScanner(source)

    let foundConstructor = false

    while (!ss.eos()) {

      const cs = ss.scanUntil(/\/\*\*/)
      if (cs == null) break
      const csp = ss.pointer() - 3
      ss.scanUntil(/\*\/\n/)
      const cep = ss.pointer()
      const comment = source.substring(csp, cep)
      const lineNumber = utils.findLineNumberOfPosition(source, csp)
      const nextLine = ss.scanUntil(/\n/)

      if (nextLine === null || nextLine.trim() == '') {
        metadata.fileComment = comment
        continue
      }

      let match

      if (foundConstructor == false) {

        // function(){}
        match = nextLine.match(Parser.T_CONSTRUCTOR_FUNCTION)

        if (match != null) {

          metadata.constructor = {
            type: Metadata.CONSTRUCTOR_FUNCTION,
            line: lineNumber,
            comment: comment,
            name: match[1],
            arguments: match[2] !== '' ? match[2].split(',') : null
          }
          foundConstructor = true
          continue
        }

        // var Foo = function(){}
        match = nextLine.match(Parser.T_CONSTRUCTOR_FUNCTION_VARIABLE)

        if (match != null) {

          metadata.constructor = {
            type: Metadata.CONSTRUCTOR_FUNCTION_VARIABLE,
            line: lineNumber,
            comment: comment,
            name: match[1],
            arguments: match[2] !== '' ? match[2].split(',') : null
          }
          foundConstructor = true
          continue
        }

        // var Foo = { ... }
        match = nextLine.match(Parser.T_CONSTRUCTOR_OBJECT_LITERAL)

        if (match != null) {

          metadata.constructor = {
            type: Metadata.CONSTRUCTOR_OBJECT_LITERAL,
            line: lineNumber,
            comment: comment,
            name: match[1],
            arguments: null
          }
          foundConstructor = true
          continue
        }
      }

      // foo: function(){}
      match = nextLine.match(Parser.T_FUNCTION)

      if (match != null) {

        metadata.methods.push({
          comment: comment,
          line: lineNumber,
          name: match[1],
          arguments: match[3] !== '' ? match[3].split(',') : null
        })

      }
      else {

        // foo: "my property"
        match = nextLine.match(Parser.T_PROPERTY)
        if (match != null) {
          metadata.properties.push({
            comment: comment,
            line: lineNumber,
            name: match[1],
            body: match[3]
          })
        }

      }
    }

    return metadata
  }
}
