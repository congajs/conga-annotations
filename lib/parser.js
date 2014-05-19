/*
 * This file is part of the conga-annotations module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var fs = require('fs');
var StringScanner = require("StringScanner");

var Metadata = require('./metadata');

/**
 * This constructor parses a given file path and returns
 * a Metadata object with information about the file's
 * constructor, methods, properties, etc...
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
function Parser() { }

Parser.prototype = {

	/**
	 * foo: function(){}
	 */
	T_FUNCTION: /(\w+)(.*): *function\((.*)\)/,
	
	/**
	 * foo: "some variable"
	 */
	T_PROPERTY: /(\w+)(.*): *(((?!function).)*)\n/,

	/**
	 * function MyConstructor(){}
	 */
	T_CONSTRUCTOR_FUNCTION: /function (.*)\((.*)\)/,
	
	/**
	 * var MyConstructor = function(){}
	 */
	T_CONSTRUCTOR_FUNCTION_VARIABLE: /var (.*) = function\((.*)\)/,
	
	/**
	 * var MyConstructor = { ... }
	 */
	T_CONSTRUCTOR_OBJECT_LITERAL: /var (.*) = {\n/,
 
	/**
	 * MyConstructor.prototype.myMethod = function(){}
	 */
	T_PROTOTYPE_METHOD: /(\w+)(.*).prototype.(.*) = function/,
	
	/**
	 * MyConstructor.prototype.myProperty = 'foo';
	 */
	T_PROTOTYPE_PROPERTY: /P.prototype.(.*) = (.*);/,
 
	/**
	 * Parse the Metadata from a given javascript file path
	 * 
	 * @param {String} path
	 * @returns {Metadata}
	 */
	parseFile: function(path){
		var stat = fs.lstatSync(path);
		if (!stat || !stat.isFile()) {
			return null;
		}
		var metadata = this.parseSource(fs.readFileSync(path).toString());
		metadata.path = path;
		return metadata;
	},
	
	/**
	 * Parse the Metadata from a file content string
	 * 
	 * @param {String} source
	 * @returns {Metadata}
	 */ 
	parseSource: function(source){
 
		var metadata = new Metadata();
		var ss = new StringScanner(source);
 
		var foundConstructor = false;
 
		while (!ss.eos()){
 
			var cs = ss.scanUntil(/\/\*\*/);
			if (cs == null) break;
			var csp = ss.pointer()-3;
			var ce = ss.scanUntil(/\*\/\n/);
			var cep = ss.pointer();
			var comment = source.substring(csp, cep);
			var lineNumber = this.findLineNumberOfPosition(source, csp);
			var nextLine = ss.scanUntil(/\n/);
 
			if (nextLine === null || nextLine.trim() == ''){
				metadata.fileComment = comment;
				continue;
			}
 
			var match;
 
			if (foundConstructor == false){
				
				// function(){}
				match = nextLine.match(this.T_CONSTRUCTOR_FUNCTION);

				if (match != null){
					
					metadata.constructor = {
						type: Metadata.CONSTRUCTOR_FUNCTION,
						line: lineNumber,
						comment: comment,
						name: match[1],
						arguments: match[2] !== '' ? match[2].split(',') : null
					};
					foundConstructor = true;
					continue;
				}
				
				// var Foo = function(){}
				match = nextLine.match(this.T_CONSTRUCTOR_FUNCTION_VARIABLE);

				if (match != null){

					metadata.constructor = {
						type: Metadata.CONSTRUCTOR_FUNCTION_VARIABLE,
						line: lineNumber,
						comment: comment,
						name: match[1],
						arguments: match[2] !== '' ? match[2].split(',') : null
					};
					foundConstructor = true;
					continue;
				}
				
				// var Foo = { ... }
				match = nextLine.match(this.T_CONSTRUCTOR_OBJECT_LITERAL);

				if (match != null){

					metadata.constructor = {
						type: Metadata.CONSTRUCTOR_OBJECT_LITERAL,
						line: lineNumber,
						comment: comment,
						name: match[1],
						arguments: null
					};
					foundConstructor = true;
					continue;
				}
			}
 
			// foo: function(){}
			match = nextLine.match(this.T_FUNCTION);

			if (match != null){

				metadata.methods.push({
					comment: comment,
					line: lineNumber,
					name: match[1],
					arguments: match[3] !== '' ? match[3].split(',') : null
				});
				continue;

			} else {
				
				// foo: "my property"
				match = nextLine.match(this.T_PROPERTY);
				if(match != null){
					metadata.properties.push({
						comment: comment,
						line: lineNumber,
						name: match[1],
						body: match[3]
					});
				}
				continue;

			}
		}

		return metadata;
	},
 
	/**
	 * Find the line number of a given position within the
	 * given file source string
	 * 
	 * @param {String} src
	 * @param {Number} position
	 * @returns {Number}
	 */
	findLineNumberOfPosition: function(src, position){
		var str = src.substring(0, position);
		try {
			return((str.match(/[^\n]*\n[^\n]*/gi).length) + 1);
		} catch(e) {
			return 1;
		}
	}
};

Parser.prototype.constructor = Parser;

module.exports = Parser;
