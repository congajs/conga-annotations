/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The Annotation constants
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Annotation = function(data){

	if (typeof data === 'object'){
		for (var property in data){
			this[property] = data[property];
		}
	}

	// call the init method with given data if it exists
	if (typeof this.init === 'function'){
		this.init(data);
	}
};

/**
 * Constructor annotation type
 * 
 * @var {Number}
 */
Annotation.CONSTRUCTOR = 1;

/**
 * Property annotation type
 * 
 * @var {Number}
 */
Annotation.PROPERTY = 2;

/**
 * Method annotation type
 * 
 * @var {Number}
 */
Annotation.METHOD = 3;

/**
 * Nested annotation type
 * 
 * @type {Number}
 */
Annotation.ANNOTATION = 4;

/**
 * The target types
 * 
 * @type {Array}
 */
Annotation.targets = [Annotation.CONSTRUCTOR, Annotation.METHOD, Annotation.PROPERTY, Annotation.ANNOTATION];

/**
 * The annotation to parse
 * 
 * @type {String}
 */
Annotation.annotation = null;

Annotation.prototype = {

	/**
	 * The main annotation value
	 * 
	 * @type {Mixed}
	 */
	value: null

};

/**
 * Extend the base annotation
 * 
 * @param  {Object} options
 * @return {Annotation}
 */
Annotation.extend = function(options){

	var Ann = function(data){
		Annotation.call(this, data);
	}

	Ann.prototype = Object.create(Annotation.prototype);

	Ann.annotation = options.annotation;
	Ann.targets = options.targets;

	delete options.targets;

	for (var i in options){
		Ann.prototype[i] = options[i];
	}

	return Ann;
};


module.exports = Annotation;