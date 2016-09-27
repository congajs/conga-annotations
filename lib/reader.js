'use strict'

const StringScanner = require('StringScanner')

const Annotation = require('./annotation')
const AttributeParser = require('./attribute-parser')
const Parser = require('./parseres5')
const ES6Parser = require('./parseres6')

/**
 * This class parses finds and returns information
 * about all annotations found in a given file path
 * based on annotations registered in the given registry.
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class Reader {

  static get ES5() {
    return 1
  }

  static get ES6() {
    return 2
  }

  constructor(registry, globalContext) {
    this.registry = registry
    this.parser = new ES6Parser()
    this.attributeParser = new AttributeParser(globalContext)

    this.currentMode = Reader.ES6

    this.annotationMap = {
      'DEFINITION': [],
      'CONSTRUCTOR': [],
      'METHOD': [],
      'PROPERTY': []
    }

    this.definitionAnnotations = []
    this.constructorAnnotations = []
    this.methodAnnotations = []
    this.propertyAnnotations = []
  }

  parse(path, mode) {
    if (!mode) {
      mode = Reader.ES6
    }

    if (mode != this.currentMode) {
      this.currentMode = mode
      this.parser = this.currentMode == Reader.ES5 ? new Parser() : new ES6Parser()
    }

    // reset parsed annotations
    this.methodAnnotations = []
    this.constructorAnnotations = []
    this.propertyAnnotations = []
    this.definitionAnnotations = []

    this.createAnnotationMap()

    const metadata = this.parser.parseFile(path)

    if (metadata) {

      if (metadata.constructor) {
        this.constructorAnnotations = this.parseConstructorAnnotations(metadata.constructor.className, metadata.constructor.name, metadata.constructor.comment, path)
      }

      if (metadata.definition) {
        this.definitionAnnotations = this.parseDefinitionAnnotations(metadata.definition.name, metadata.definition.comment, path)
      }

      const methods = metadata.methods

      methods.forEach(function(methodMetadata) {
        const methodAnnotation = this.parseMethodAnnotations(methodMetadata.className, methodMetadata.name, methodMetadata.comment, path)
        this.methodAnnotations.push.apply(this.methodAnnotations, methodAnnotation)
      }.bind(this))

      const properties = metadata.properties

      properties.forEach(function(propertyMetadata) {
        const propertyAnnotation = this.parsePropertyAnnotations(propertyMetadata.className, propertyMetadata.name, propertyMetadata.comment, path)
        this.propertyAnnotations.push.apply(this.propertyAnnotations, propertyAnnotation)
      }.bind(this))

    }
  }

  parseAttributeAnnotations(annotationsToFind, attribute, filePath) {
    return this.parseAnnotations(null, null, attribute, annotationsToFind, filePath)
  }

  /**
   * Parse the constructor annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseConstructorAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, this.annotationMap['CONSTRUCTOR'], filePath)
  }

  /**
   * Parse the class definition annotations
   *
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseDefinitionAnnotations(target, comment, filePath) {
    return this.parseAnnotations(null, target, comment, this.annotationMap['DEFINITION'], filePath)
  }

  /**
   * Parse the method annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseMethodAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, this.annotationMap['METHOD'], filePath)
  }

  /**
   * Parse the property annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parsePropertyAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, this.annotationMap['PROPERTY'], filePath)
  }

  /**
   * Create the mapping of target types to annotation names
   * from the current Registry
   *
   * @returns {void}
   */
  createAnnotationMap() {

    const annotations = this.registry.annotations

    for (const i in annotations) {

      const annotationName = annotations[i].annotation || annotations[i].name
      const targets = annotations[i].targets

      targets.forEach(function(target) {
        switch (target) {
        case Annotation.DEFINITION:
          this.annotationMap.DEFINITION.push(annotationName)
          break

        case Annotation.CONSTRUCTOR:
          this.annotationMap.CONSTRUCTOR.push(annotationName)
          break

        case Annotation.PROPERTY:
          this.annotationMap.PROPERTY.push(annotationName)
          break

        case Annotation.METHOD:
          this.annotationMap.METHOD.push(annotationName)
          break
        }
      }.bind(this))
    }
  }

  /**
   * Parse the annotations found in a comment string into objects
   *
   * @param className
   * @param target
   * @param comment
   * @param annotationsToFind
   * @param filePath
   * @returns {Array}
   */
  parseAnnotations(className, target, comment, annotationsToFind, filePath) {

    const ss = new StringScanner(comment)

    const annotations = []


    let annotation = null
    let parameters = null
    while (!ss.eos()) {

      annotation = null
      parameters = null

      // check if there are anymore annotations to find
      if (ss.scanUntil(/@/) === null) {
        break
      }

      // check if this is an annotation with parameters
      const annotationCheck = ss.checkUntil(/\(/)

      // went to a next line, so it doesn't have parameters
      if (annotationCheck === null || annotationCheck.match(/\n/)) {

        annotation = ss.scanUntil(/\n/)
        annotation = annotation.trim('\n')

        // has parameters
      }
      else {

        annotation = ss.scanUntil(/\(/)
        annotation = annotation.substring(0, annotation.length - 1)

        let done = false

        parameters = ''

        while (!done) {

          const scan = ss.scanUntil(/\)/g)

          if (scan === null) {
            done = true
          }
          else {

            parameters = parameters + scan

            const open = parameters.match(/\(/) === null ? 1 : parameters.match(/\(/g).length + 1
            const close = parameters.match(/\)/) === null ? 0 : parameters.match(/\)/g).length

            if (open === close) {
              done = true
            }
          }
        }

        parameters = parameters.substring(0, parameters.length - 1)
      }

      if (annotationsToFind.indexOf(annotation) >= 0) {

        let attributes = {}

        if (parameters !== null) {
          attributes = this.attributeParser.parse(this, annotationsToFind, parameters)
        }

        const AnnotationClass = this.registry.getAnnotationConstructor(annotation)
        const annotationObj = new AnnotationClass(attributes, filePath)

        if (className) {
          annotationObj.className = className
        }

        annotationObj.target = target
        annotations.push(annotationObj)
      }
    }
    return annotations
  }
}
