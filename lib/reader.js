/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Annotation = require('./annotation');
var AttributeParser = require('./attribute-parser');
var Parser = require('./parser');

/**
 * This class handles the parsing of annotations
 * from a file
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Reader = function(registry){
  
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
      'CONSTRUCTOR': [],
      'METHOD': [],
      'PROPERTY': []
  };
  
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
  this.parse = function(path){

    // reset parsed annotations
    __methodAnnotations = [];
    __propertyAnnotations = [];

    __createAnnotationMap();
    
    var metadata = __parser.parseFile(path);
  
    __constructorAnnotations = __parseConstructorAnnotations(metadata.getConstructor().name, metadata.getConstructor().comment);
  
    var methods = metadata.getMethods();
  
    methods.forEach(function(methodMetadata){
      var methodAnnotation = __parseMethodAnnotations(methodMetadata.name, methodMetadata.comment);
      __methodAnnotations.push.apply(__methodAnnotations, methodAnnotation);
    });
    
    var properties = metadata.getProperties();
    properties.forEach(function(propertyMetadata){
      var propertyAnnotation = __parsePropertyAnnotations(propertyMetadata.name, propertyMetadata.comment);
      __propertyAnnotations.push.apply(__propertyAnnotations, propertyAnnotation);    
    });
  };
  
  /**
   * Get the constructor annotations
   * 
   * @returns {Array}
   */
  this.getConstructorAnnotations = function(){
    return __constructorAnnotations;
  };

  /**
   * Get the method annotations
   * 
   * @returns {Array}
   */
  this.getMethodAnnotations = function(){
    return __methodAnnotations;
  };
  
  /**
   * Get the property annotations
   * 
   * @returns {Array}
   */
  this.getPropertyAnnotations = function(){
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
   * @param {Metadata} metadata
   */
  __parseConstructorAnnotations = function(target, comment){
    return __parseAnnotations(target, comment, __annotationMap['CONSTRUCTOR']);
  };

  /**
   * Parse the method annotations
   * 
   * @param {Metadata} metadata
   */
  __parseMethodAnnotations = function(target, comment){
    return __parseAnnotations(target, comment, __annotationMap['METHOD']);
  };

  /**
   * Parse the property annotations
   * 
   * @param {Metadata} metadata
   */
  __parsePropertyAnnotations = function(target, comment){
    return __parseAnnotations(target, comment, __annotationMap['PROPERTY']);
  };

  /**
   * Create the mapping of target types to annotation names
   * from the current Registry
   * 
   * @returns {void}
   */
  __createAnnotationMap = function(){
    
    var annotations = __registry.getAnnotations();
    
    for(var i in annotations){
      var annotationName = annotations[i].annotation;
      var targets = annotations[i].targets;
      
      targets.forEach(function(target){
        switch(target){
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
   * @param comment
   * @param annotationsToFind
   * @returns {Array}
   */
  __parseAnnotations = function(target, comment, annotationsToFind){

    var ANNOTATION_TOKEN_REG = new RegExp("@(\\w+[:]?\\w+)");
    var ANNOTATION_VARS_REG = new RegExp("\\(([^]+)\\)");
    var ANNOTATION_REG = new RegExp("@([^!\\)]+)\\)", "g");   
    
    var matches = comment.match(ANNOTATION_REG);
    var annotations = [];
    var ann;

    if(matches){
      matches.forEach(function(annotationString){
        var annotationToken = ANNOTATION_TOKEN_REG.exec(annotationString)[1];
        if(annotationsToFind.indexOf(annotationToken) >= 0){
  
          if(!ann){
            ann = {};
          }
          ann[annotationToken] = {};
          var attributes = {};
          if(ANNOTATION_VARS_REG.test(annotationString)){
              var vars = ANNOTATION_VARS_REG.exec(annotationString)[1];
              attributes = __attributeParser.parse(vars);
          }
          
          var annotationClass = __registry.getAnnotationConstructor(annotationToken);
          var annotation = new annotationClass(attributes);
          
          annotation.target = target;
          annotations.push(annotation);
        }
      });
    }
  
    return annotations;
  };
};

module.exports = Reader;