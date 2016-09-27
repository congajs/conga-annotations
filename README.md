# conga-annotations 

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]


## Overview

This is a Node.js library which allows you to add annotations describing metdata data
about classes, constructors, methods, and properties within javascript files.

ES6 Example:

    /**
     * @MyClassAnnotation("hello world")
     */
    class HelloWorld {

        constructor() {

            /**
             * @MyPropertyAnnotation(foo=[1,2,3,4], bar={"hello":"there"})
             */   
            this.myProperty = 'foo'
        }

        /**
         * @MyMethodAnnotation("foobar", something="hello")
         */
        myMethod() {

        }

    }

ES5 Example:

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

    > npm install conga-annotations

## Usage

Full example in [example folder](https://github.com/congajs/conga-annotations/tree/master/example) (`node main.js` to test is). 

### Create an Annotation

    // my-class-annotation.js
    // ----------------------------
    'use strict'
    const Annotation = require('conga-annotations').Annotation;

    module.exports = class MyClassAnnotation extends Annotation {

        /**
         * The possible targets
         *
         * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
         *
         * @type {Array}
         */
        static get targets() { return [Annotation.DEFINITION] }

        /**
         * Constructor to add attributes
         * @type {Array}
         */
        constructor(data, filePath){
          super(data, filePath)        
        }
        
        /**
         * Optional initialization method that
         * can be used to transform data
         *
         * @param  {Object} data
         * @return {void}
         */
        init: function(data){

            // set defaults
            this.value = data.value || 'default value'
            this.sample = data.sample || 'default value for sample'

            // do something with data (error check, etc.)
        }
        
    });


### Add the Annotation to a File

    // my-sample.js
    // ------------

    /**
     * @MyClassAnnotation("some value", sample="here is an attribute value")
     */
    class HelloWorld {}

### Parse the Annotation

    // my-parser.js
    // ------------

    const path = require('path')
    const annotations = require('conga-annotations')

    // create the registry
    const registry = new annotations.Registry()

    // add annotations to the registry
    registry.registerAnnotation(path.join(__dirname, 'my-class-annotation'))

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
        if (annotation.constructor.name === 'MyClassAnnotation'){

            // do something with the annotation data
            console.log(annotation.target); // -> "HelloWorld"
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
[MIT](https://github.com/conga/conga-annotations/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/conga-annotations.svg?style=flat-square
[npm-url]: https://npmjs.org/package/conga-annotations
[npm-download]: https://img.shields.io/npm/dt/conga-annotations.svg
[ci-image]: https://travis-ci.org/congajs/conga-annotations.svg?branch=master
[ci-url]: https://travis-ci.org/congajs/conga-annotations
[daviddm-image]: http://img.shields.io/david/congajs/conga-annotations.svg?style=flat-square
[daviddm-url]: https://david-dm.org/congajs/conga-annotations
[codeclimate-image]: https://img.shields.io/codeclimate/github/congajs/conga-annotations.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/congajs/conga-annotations


