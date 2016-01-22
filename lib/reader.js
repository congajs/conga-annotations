/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var StringScanner = require('StringScanner');

var Annotation = require('./annotation');
var AttributeParser = require('./attribute-parser');
var Parser = require('./parser');
var ES6Parser = require('./es6Parser');

/**
 * This class handles the parsing of annotations
 * from a file
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Reader = function (registry) {

  var __currentMode = Reader.ES5

  /**
   * Get reference to this function
   *
   * @var {Reader}
   */
  var __that = this;

  /**
   * The annotation Registry
   *
   * @var {Registry}
   */
  var __registry = registry;

  /**
   * The annotation parser
   *
   * @var {Parser}
   */
  var __parser = new Parser();

  /**
   * The attribute parser
   *
   * @var {AttributeParser}
   */
  var __attributeParser = new AttributeParser();

  /**
   * The mapping of annotation types to annotation data
   *
   * @var {Object}
   */
  var __annotationMap = {
    'DEFINITION': [],
    'CONSTRUCTOR': [],
    'METHOD': [],
    'PROPERTY': []
  };

  /**
   * Array of class definition annotations that were parsed
   *
   * @var {Array}
   */
  var __definitionAnnotations = [];


  /**
   * Array of constructor annotations that were parsed
   *
   * @var {Array}
   */
  var __constructorAnnotations = [];

  /**
   * Array of method annotations that were parsed
   *
   * @var {Array}
   */
  var __methodAnnotations = [];

  /**
   * Array of property annotations that were parsed
   *
   * @var {Array}
   */
  var __propertyAnnotations = [];

  /**
   * ================================================================
   * Public methods
   * ================================================================
   */

  /**
   * Parse all of the annotations from a given file path
   *
   * @param {String} path
   */
  this.parse = function (path, mode) {

    if (!mode) {
      mode = Reader.ES5;
    }

    if (mode != __currentMode) {
      __currentMode = mode;
      __parser = __currentMode == Reader.ES5 ? new Parser() : new ES6Parser();
    }

    // reset parsed annotations
    __methodAnnotations = [];
    __propertyAnnotations = [];
    __definitionAnnotations = [];

    __createAnnotationMap();

    var metadata = __parser.parseFile(path);

    if (metadata) {

      if (metadata.getConstructor()) {
        __constructorAnnotations = __parseConstructorAnnotations(metadata.getConstructor().className, metadata.getConstructor().name, metadata.getConstructor().comment, path);
      }

      if (metadata.getDefinition()) {
        __definitionAnnotations = __parseDefinitionAnnotations(metadata.getDefinition().name, metadata.getDefinition().comment, path);
      }

      var methods = metadata.getMethods();

      methods.forEach(function (methodMetadata) {
        var methodAnnotation = __parseMethodAnnotations(methodMetadata.className, methodMetadata.name, methodMetadata.comment, path);
        __methodAnnotations.push.apply(__methodAnnotations, methodAnnotation);
      });

      var properties = metadata.getProperties();

      properties.forEach(function (propertyMetadata) {
        var propertyAnnotation = __parsePropertyAnnotations(propertyMetadata.className, propertyMetadata.name, propertyMetadata.comment, path);
        __propertyAnnotations.push.apply(__propertyAnnotations, propertyAnnotation);
      });

    }
  };

  this.parseAttributeAnnotations = function (annotationsToFind, attribute, filePath) {
    return __parseAnnotations(null, null, attribute, annotationsToFind, filePath);
  };

  /**
   * Get the constructor annotations
   *
   * @returns {Array}
   */
  this.getConstructorAnnotations = function () {
    return __constructorAnnotations;
  };

  /**
   * Get definition annotations
   *
   * @returns {Array}
   */
  this.getDefinitionAnnotations = function () {
    return __definitionAnnotations;
  };

  /**
   * Get the method annotations
   *
   * @returns {Array}
   */
  this.getMethodAnnotations = function () {
    return __methodAnnotations;
  };

  /**
   * Get the property annotations
   *
   * @returns {Array}
   */
  this.getPropertyAnnotations = function () {
    return __propertyAnnotations;
  };

  /**
   * ================================================================
   * Private methods
   * ================================================================
   */

  /**
   * Parse the constructor annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  __parseConstructorAnnotations = function (className, target, comment, filePath) {
    return __parseAnnotations(className, target, comment, __annotationMap['CONSTRUCTOR'], filePath);
  };

  /**
   * Parse the class definition annotations
   *
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  __parseDefinitionAnnotations = function (target, comment, filePath) {
    return __parseAnnotations(null, target, comment, __annotationMap['DEFINITION'], filePath);
  };

  /**
   * Parse the method annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  __parseMethodAnnotations = function (className, target, comment, filePath) {
    return __parseAnnotations(className, target, comment, __annotationMap['METHOD'], filePath);
  };

  /**
   * Parse the property annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  __parsePropertyAnnotations = function (className, target, comment, filePath) {
    return __parseAnnotations(className, target, comment, __annotationMap['PROPERTY'], filePath);
  };

  /**
   * Create the mapping of target types to annotation names
   * from the current Registry
   *
   * @returns {void}
   */
  __createAnnotationMap = function () {

    var annotations = __registry.getAnnotations();

    for (var i in annotations) {

      var annotationName = annotations[i].annotation;
      var targets = annotations[i].targets;

      targets.forEach(function (target) {
        switch (target) {
          case Annotation.DEFINITION:
            __annotationMap.DEFINITION.push(annotationName);
            break;

          case Annotation.CONSTRUCTOR:
            __annotationMap.CONSTRUCTOR.push(annotationName);
            break;

          case Annotation.PROPERTY:
            __annotationMap.PROPERTY.push(annotationName);
            break;

          case Annotation.METHOD:
            __annotationMap.METHOD.push(annotationName);
            break;
        }
      });
    }
  };

  /**
   * Parse the annotations found in a comment string into objects
   *
   * @param target
   * @param comment
   * @param annotationsToFind
   * @param filePath
   * @returns {Array}
   */
  __parseAnnotations = function (className, target, comment, annotationsToFind, filePath) {

    var ss = new StringScanner(comment);

    var annotations = [];

    while (!ss.eos()) {

      var annotation = null;
      var parameters = null;

      // check if there are anymore annotations to find
      if (ss.scanUntil(/@/) === null) {
        break;
      }

      // check if this is an annotation with parameters
      var annotationCheck = ss.checkUntil(/\(/);

      // went to a next line, so it doesn't have parameters
      if (annotationCheck === null || annotationCheck.match(/\n/)) {

        annotation = ss.scanUntil(/\n/);
        annotation = annotation.trim('\n');

        // has parameters
      } else {

        annotation = ss.scanUntil(/\(/);
        annotation = annotation.substring(0, annotation.length - 1);

        var done = false;

        parameters = '';

        while (!done) {

          var scan = ss.scanUntil(/\)/g);

          if (scan === null) {
            done = true;
          } else {

            parameters = parameters + scan;

            var open = parameters.match(/\(/) === null ? 1 : parameters.match(/\(/g).length + 1;
            var close = parameters.match(/\)/) === null ? 0 : parameters.match(/\)/g).length;

            if (open === close) {
              done = true;
            }
          }
        }

        parameters = parameters.substring(0, parameters.length - 1);
      }

      if (annotationsToFind.indexOf(annotation) >= 0) {

        var attributes = {};

        if (parameters !== null) {
          attributes = __attributeParser.parse(__that, annotationsToFind, parameters);
        }

        var annotationClass = __registry.getAnnotationConstructor(annotation);
        var annotationObj = new annotationClass(attributes, filePath);

        if (className) {
          annotationObj.className = className;
        }

        annotationObj.target = target;
        annotations.push(annotationObj);
      }
    }

    return annotations;
  }
};

Reader.ES5 = 1;
Reader.ES6 = 2;

module.exports = Reader;