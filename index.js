/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Export the public constructors
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = {
  Annotation: require('./lib/annotation'),
  Registry: require('./lib/registry'),
  Reader: require('./lib/reader')
};