# ecmas-annotations 
[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

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
Need Node >= 4.0.0

    > npm install ecmas-annotations

## Usage

Full example in [xample folder](https://github.com/jaumard/ecmas-annotations/tree/master/example) (`node main.js` to test is). 

### Create an Annotation

    // my-constructor-annotation.js
    // ----------------------------
    'use strict'
    const Annotation = require('esmac-annotations').Annotation;

    module.exports = class MyConstructorAnnotation extends Annotation {

        /**
         * The possible targets
         *
         * (Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
         *
         * @type {Array}
         */
        static get targets() { return [Annotation.CONSTRUCTOR] }

        /**
         * Constructor to add attributes
         * @type {Array}
         */
        constructor(data, filePath){
          super(data, filePath)
          /**
           * The main value
           *
           * @type {String}
           */
          value = 'default value'
  
          /**
           * An additional attribute
           *
           * @type {String}
           */
          sample = 'default value for sample'
        
        }
        
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

    const path = require('path')
    const annotations = require('ecmas-annotations')

    // create the registry
    const registry = new annotations.Registry()

    // add annotations to the registry
    registry.registerAnnotation(path.join(__dirname, 'my-constructor-annotation'))

    // create the annotation reader
    const reader = new annotations.Reader(registry)

    // parse the annotations from a file, default parse ES6 file, Reader.ES5 to force ES5
    reader.parse(path.join(__dirname, 'my-sample.js'), Reader.ES6)

    // get the annotations
    const definitionAnnotations = reader.definitionAnnotations
    const constructorAnnotations = reader.constructorAnnotations
    const methodAnnotations = reader.methodAnnotations
    const propertyAnnotations = reader.propertyAnnotations

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
    @MyAnnotation(foo=@MyNestedAnnotation("this is nested", foo=true))

    // array of nested annotations
    @MyAnnotation(foo=[@MyNestedAnnotation("nested 1"), @MyNestedAnnotation("nested 2")])

## License
[MIT](https://github.com/jaumard/ecmas-annotations/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/ecmas-annotations.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ecmas-annotations
[ci-image]: https://travis-ci.org/jaumard/ecmas-annotations.svg?branch=master
[ci-url]: https://travis-ci.org/jaumard/ecmas-annotations
[daviddm-image]: http://img.shields.io/david/jaumard/ecmas-annotations.svg?style=flat-square
[daviddm-url]: https://david-dm.org/jaumard/ecmas-annotations
[codeclimate-image]: https://img.shields.io/codeclimate/github/jaumard/ecmas-annotations.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/jaumard/ecmas-annotations
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/trailsjs/trails

