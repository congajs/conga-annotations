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
var Annotation = function(){};

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

module.exports = Annotation;