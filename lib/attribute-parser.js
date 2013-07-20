/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The AttributeParser handles parsing out attributes
 * from a given string
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var AttributeParser = function(){};

AttributeParser.prototype = {

	/**
	 * Array of patterns to use in the tokenize method
	 * 
	 * @var {Array}
	 */
	patterns: [
		/^\s+/, // whitespace
		/^[^\s]+/ // word
	],

	/**
	 * Convert a string of annotation attributes into
	 * a hash of actual javascript values
	 * 
	 * @param  {String} string
	 * @return {Object}
	 */
	parse: function(reader, annotationsToFind, string){

		var tokens = this.__tokenize(string);
		var fixedString = '';

		// clean up comment asterisks and line breaks
		tokens.forEach(function(token){
			if (token.trim('') !== '*'){
				fixedString += token.replace('\n', '');
			}
		});

		// split all commas
		var parts = fixedString.split(',');

		var isContinue = true;
		var i = parts.length - 1;

		var fixed = [];

		while (isContinue){

			var part = parts[i];

			var isArray = false;
			var isObject = false;
			var isAnnotation = false;

			// check for annotation, array, or object close
			if (part.trim().substr(part.trim().length-2, 2) === ')}' && !part.trim().match(/(.*)=\{@\(/)){
				isAnnotation = true;
			} else if (part.trim()[part.trim().length - 1] === ']' && !part.trim().match(/(.*)=\[/)){
				isArray = true;
			} else if (part.trim()[part.trim().length - 1] === '}' && !part.trim().match(/(.*)=\{/)){
				isObject = true;
			}

			// if this is an annotation, array, or object, combine original string until
			// the start of the target type
			if (isArray || isObject || isAnnotation){

				var temp = part;
				var found = false;

				// re-combine array into one piece
				while (!found){

					i--;

					if (i<0){
						break;
					}

					part = parts[i];

					temp = part + ',' + temp;

					if ((isArray && part.trim().match(/(.*)=\[/)) || 
						(isObject && part.trim().match(/(.*)=\{/)) || 
						(isAnnotation && part.trim().match(/(.*)=\{@(.*)\(/))){

						found = true;
					}
				}

				fixed.unshift(temp);

			} else {
				fixed.unshift(part);
			}

			i--;

			if (i < 0){
				isContinue = false;
			}
		}

		var args = {};
		var i=0;

		fixed.forEach(function(token){

			// check for single values (no key=value)
			if (i==0 && token.trim().indexOf("=") === -1){
				arg = "value";
				v = token.trim().replace(/\"/g, '');
				
			// split attributes on key=value
			} else {

				// split token on first equals, while maintaining the rest of the string
				var split = token.split(/=/);
				var arg = split.shift().replace(/\"/g, '');
				var value = split.join('=').trim();

				if (value.substring(0, 2) === '{@'){

					var annotation = value.substr(1, value.length - 2);
					v = reader.parseAttributeAnnotation(annotationsToFind, annotation);

				} else {
					var exp = "var v = " + value;
					eval(exp); // eval is evil except in this case!					
				}
			}

			args[arg.trim()] = v;

			i++;
		});

		return args;
	},

	/**
	 * Tokenize a string into each of it's parts
	 * 
	 * @param {String} src
	 * @returns {Array}
	 */
	__tokenize: function(src){
		
		var source = src;
		var tokens = [];
		var regexQueue = [];
		
		for (var i in this.patterns){
			var re = this.patterns[i];
			(function(re){
				regexQueue.push(function () {
					var ret = false;
					var result = re.exec(source);
					if (result) {
						tokens.push(result[0]);
						source = source.substring(result[0].length);
						ret = true;
					}
					return ret;
				});   
			})(re);
		}
		
		while (source) {
			var foundToken = regexQueue.some(function (element, index, array) {
				return element();
			});
		}

		return tokens;
	}
};

module.exports = AttributeParser;