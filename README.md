# conga-annotations [![Build Status](https://secure.travis-ci.org/congajs/conga-annotations.png)](http://travis-ci.org/congajs/conga-annotations)

## Overview

This is a Node.js library which allows you to add annotations describing metdata data
about constructors, methods, and properties within javascript files.

Example:


    /**
     * @MyConstructorAnnotation("some value")
     */
    function HelloWorld(){}

    HelloWorld.prototype = {
        
        /**
         * @MyPropertyAnnotation(foo=[1,2,3,4], bar={"hello":"there"})
         */
        myProperty: 'foo',

        /**
         * @MyMethodAnnotation("foobar", something="hello")
         */
        myMethod: function(){

        }
    }


## Installation

    > npm install conga-annotations

## Usage

### Create an Annotation

    // my-constructor-annotation.js
    // ----------------------------

    var Annotation = require('conga-annotations').Annotation;

    module.exports = Annotation.extend({

        /**
         * The name of the annotation

         * @type {String}
         */
        annotation: 'MyConstructorAnnotation',

        /**
         * The possible targets
         *
         * (Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
         *
         * @type {Array}
         */
        targets: [Annotation.CONSTRUCTOR],

        /**
         * The main value
         *
         * @type {String}
         */
        value: 'default value',

        /**
         * An additional attribute
         *
         * @type {String}
         */
        sample: 'default value for sample',
        
        /**
         * Optional initialization method that
         * can be used to transform data
         *
         * @param  {Object} data
         * @return {void}
         */
        init: function(data){
            // do something with data
        }
        
    });


### Add the Annotation to a File

    // my-sample.js
    // ------------

    /**
     * @MyConstructorAnnotation("some value", sample="here is an attribute value")
     */
    function MySample(){}

### Parse the Annotation

    // my-parser.js
    // ------------

    var path = require('path');
    var annotations = require('conga-annotations');

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
        if (annotation.annotation === 'MyConstructorAnnotation'){

            // do something with the annotation data
            console.log(annotation.target); // -> "MySample"
            console.log(annotation.value); // -> "some value"
            console.log(annotation.sample); // -> "here is an attribute value"
        }

    });

## Supported Attribute Types

    // string
    @MyAnnotation(foo="a string")

    // boolean
    @MyAnnotation(foo=true)

    // array
    @MyAnnotation(foo=[1,2,3,4])

    // object
    @MyAnnotation(foo={hi:"there"})

    // nested annotations
    @MyAnnotation(foo={@MyNestedAnnotation("this is nested", foo=true) })


