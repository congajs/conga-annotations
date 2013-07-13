/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The annotation registry which holds all annotations
 * which have been registered and should be used
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Registry = function(){
	
	/**
	 * A hash of registered annotations
	 * 
	 * @var {Object}
	 */
	var __annotations = {};
	
	/**
	 * Register an annotation path
	 * 
	 * @param {String} path
	 * @returns {void}
	 */
	this.registerAnnotation = function(path){
		var annotation = require(path);
		__annotations[annotation.annotation] = annotation;
	};

	/**
	 * Get all of the annotation constructors
	 * 
	 * @returns {Object}
	 */
	this.getAnnotations = function(){
		return __annotations;
	};

	/**
	 * Get an annotation constructor by it's name
	 * 
	 * @param {String} name
	 * @returns {Function}
	 */
	this.getAnnotationConstructor = function(name){
		return __annotations[name];
	}; 
	
};

module.exports = Registry;