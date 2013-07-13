/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * This class holds the meta data information for
 * a parsed Javascript file.
 * 
 * This contains the constructor, methods, properties
 * and associated comment blocks for each.
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Metadata = function(){
	this.methods = [];
	this.properties = [];
};
 
/**
 * Function constructor type
 * 
 * I.E.:
 * 
 * function MyClass(){};
 */
Metadata.CONSTRUCTOR_FUNCTION = 1;

/**
 * Variable assigned constructor type
 * 
 * I.E.:
 * 
 * var MyClass = function(){};
 */
Metadata.CONSTRUCTOR_VARIABLE_FUNCTION = 2;

/**
 * Object literal constructor type
 * 
 * I.E.:
 * 
 * var MyClass = { ... };
 */
Metadata.CONSTRUCTOR_OBJECT_LITERAL = 3;
 
Metadata.prototype = {
		
	/**
	 * The file path to the source file
	 * 
	 * @var {String}
	 */
	path: null,
		
	/**
	 * The constructor type
	 * 
	 * @var {Number}
	 */
	constructorType: null,
	
	/**
	 * The file level comment block
	 * 
	 * @var {String}
	 */
	fileComment: null,
	
	/**
	 * The constructor information
	 * 
	 * Format:
	 * 
	 * {
	 *   name: 'MyClass',
	 *   line: 1,
	 *   comment: 'the comment block',
	 *   arguments: [a,b,c]
	 * }
	 * 
	 * @var {Object}
	 */
	constructor: null,
	
	/**
	 * The array of methods
	 * 
	 * Format:
	 * 
	 * [
	 *   {
	 *     name: 'myMethod',
	 *     line: 1,
	 *     comment: 'the comment block',
	 *     arguments: [a,b,c]
	 *   }
	 * ]
	 * 
	 * @var {Array}
	 */
	methods: null,
	
	/**
	 * The array of properties
	 * 
	 * Format:
	 * 
	 * [
	 *   {
	 *     name: 'myProperty',
	 *     line: 1,
	 *     comment: 'the comment block',
	 *     body: 'my default value'
	 *   }
	 * ]
	 * 
	 * @var {Array}
	 */
	properties: null,

	/**
	 * Set the constructor name and comments
	 * 
	 * @param {String} name
	 * @param {String} comments
	 */
	setConstructor: function(name, comments){
		this.constructor = {
			name: name,
			comments: comments
		};
	},

	/**
	 * Add a property name and comments
	 * 
	 * @param {String} name
	 * @param {String} comments
	 */
	addProperty: function(name, comments){
		this.properties.push({
			name: name,
			comments: comments
		});
	},

	/**
	 * Add a method name and comments
	 * 
	 * @param {String} name
	 * @param {Comments} comments
	 */
	addMethod: function(name, comments){
		this.methods.push({
			name: name,
			comments: comments
		});
	},

	/**
	 * Get the constructor information
	 * 
	 * @returns {Object}
	 */
	getConstructor: function(){
		return this.constructor;
	},

	/**
	 * Get all of the methods
	 * 
	 * @returns {Array}
	 */
	getMethods: function(){
		return this.methods;
	},

	/**
	 * Get all of the properties
	 * 
	 * @returns {Array}
	 */
	getProperties: function(){
		return this.properties;
	}
};

module.exports = Metadata;