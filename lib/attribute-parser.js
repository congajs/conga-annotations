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
   * Parse the attributes from a string into a hash
   * containing the names and corresponding parsed
   * Javascript values
   * 
   * @param {String} string
   * @returns {Object}
   */
  parse: function(string){

    var tokens = this.__tokenize(string);
    var args = {};
    var fixed = [];
    var inArray = false;
    var inObject = false;
    var temp = null;

    // fix tokens
    for (var i=tokens.length-1, j=0; i>=j; i--){

      var token = tokens[i].replace(/,$/, '').trim();

      if (token === '' || token === '*'){
        continue;
      }

      if (inArray){
        if (token.match(/(.*)=\[/)){
          fixed.unshift(token + ',' + temp);
          inArray = false;
          temp = null;
        } else {
          temp = token + ',' +temp;
        }

      } else if (inObject){

        if (token.match(/(.*)=\{/)){
          fixed.unshift(token + ',' + temp);
          inObject = false;
          temp = null;
        } else {
          temp = token + ',' + temp;
        }
      } else {
        if (token[token.length-1] === ']' && token.match(/(.*)=\[(.*)\]/) === null){
          
          inArray = true;
          temp = token;

        } else if (token[token.length-1] === '}' && token.match(/(.*)=\{(.*)\}/) === null){
          inObject = true;
          temp = token;

        } else {
          fixed.unshift(token);
        }        
      }
    }

    var i=0;
    fixed.forEach(function(token){

      // hacky way to fix objects and arrays that are spread across multiple lines
      token = token.replace('{,', '{');
      token = token.replace('[,', '[');

      // check for single values (no key=value)
      if (i==0 && token.indexOf("=") === -1){
        arg = "__value";
        v = token.replace(/\"/g, '');
        
      // split attributes on key=value
      } else {
        var parts = token.split('=', 2);
        var arg = parts[0].replace(/\"/g, '');
        var exp = "var v = " + parts[1];
        eval(exp); // eval is evil except in this case!
      }
      args[arg] = v;

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