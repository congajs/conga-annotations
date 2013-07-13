/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var util = require('util');

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
Annotation.PROPERTY    = 2;

/**
 * Method annotation type
 * 
 * @var {Method}
 */
Annotation.METHOD      = 3;

Annotation.name = 'Annotation';
Annotation.targets = [Annotation.CONSTRUCTOR, Annotation.METHOD, Annotation.PROPERTY];

Annotation.prototype = {

	value: null
};

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