# conga-annotations [![Build Status](https://secure.travis-ci.org/congajs/conga-annotations.png)](http://travis-ci.org/congajs/conga-annotations)

## Overview



## Installation

    > npm install conga-annotations

## Usage

### Create an Annotation

    // my-constructor-annotation.js
    var Annotation = require('conga-annotations').Annotation;

    var MyConstructorAnnotation = function(data){
        this.value = (typeof data.__value !== 'undefined') ? data.__value : 'default value';
        this.sample = (typeof data.sample !== 'undefined') ? data.sample : 'default value';
    };

    /**
     * Define the annotation string to find
     * 
     * @var {String}
     */
    MyConstructorAnnotation.annotation = 'MyConstructorAnnotation';

    /**
     * Define the targets that the annotation can be applied to
     * 
     * Possible targets: Annotation.CONSTRUCTOR, Annotation.METHOD, Annotation.PROPERTY
     *
     * @var {Array}
     */
    MyConstructorAnnotation.targets = [Annotation.CONSTRUCTOR];

    /**
     * The value of the annotation
     *
     * @type {String}
     */
    MyConstructorAnnotation.prototype.value = null;

    /**
     * An attribute for the annotation
     * 
     * @var {String}
     */
    MyConstructorAnnotation.prototype.sample = null;

    module.exports = MyConstructorAnnotation;

### Add the Annotation to a File

    // my-sample.js

    /**
     * @MyConstructorAnnotation("some value", sample="here is an attribute value")
     */
    function MySample(){}

### Parse the Annotation

    // my-parser.js

    var path = require('path');
    var annotations = require('conga-annotations');

    // load the annotation to compare against
    var MyConstructorAnnotation = require('./my-constructor-annotation');

    // create the registry
    var registry = new annotations.Registry();

    // add annotations to the registry
    registry.registerAnnotation(path.join(__dirname, 'my-constructor-annotation'));

    // create the annotation reader
    var reader = new annotations.Reader(registry);

    // parse the annotations from a file
    reader.parse(path.join(__dirname, 'my-sample.js'));

    // get the annotations
    var constructorAnnotations = reader.getConstructorAnnotations();
    var methodAnnotations = reader.getMethodAnnotations();
    var propertyAnnotations = reader.getPropertyAnnotations();

    // loop through and handle the annotations
    constructorAnnotations.forEach(function(annotation){

        // @MyConstructorAnnotation
        if (annotation instanceof MyConstructorAnnotation){

            // do something with the annotation data
            console.log(annotation.target); // -> "MySample"
            console.log(annotation.value); // -> "some value"
            console.log(annotation.sample); // -> "here is an attribute value"
        }

    });



