function Dictionary(dict){
	"use strict";
	
	var i=0,
		key=null,
		normal_keys = {},
		regexp_keys = {};
	dict = dict || [];
	if(dict.length){
		for(;i<dict.length;i++){
			if(dict[i].length && dict[i].length>1){
				add.apply(this, dict[i]);
			}
		}
	}
	
	function testRegExp(s){
		// note empty regexp is a comment and so does not exists)
		return /^\/.*[^\\]\/[img]{0,3}$/.test(s)
	}
	
	function parseRegExp(s){
		var match = /^\/(.*[^\\])\/([img]{0,3})$/.exec(s);
		if(!match) throw new SyntaxError("Not regexp string: "+s);
		return new RegExp(match[1], match[2]);
	}
	
	this.keys = function keys(){
		var res = [],
			k;
		for(k in normal_keys) res.push(k);
		for(k in regexp_keys) res.push(parseRegExp(k));
		return res;
	}
	
	this.definitionOf = function definitionOf(key){
		var res = null;
		if(key instanceof RegExp){ 
			res = regexp_keys[""+key];
		}else{
			res = normal_keys[key];
			if(res===undefined){
				if(testRegExp(key)){
					res = regexp_keys[""+key];
				}
			}
		}
		if(res===undefined) res = null;
		return res;
	}
	
	this.asArray = function(){
		var res=[],
			key;
		for(key in normal_keys){
			res.push([key, normal_keys[key]]);
		}
		for(key in regexp_keys){
			res.push([parseRegExp(key), regexp_keys[key]]);
		}
		return res;
	}
	function add(/* key, key2, ..., def */){
		var i=0,
			l=arguments.length-1,
			def = arguments[l],
			key;
		if(l>0){
			for(;i<l;i++){
				key = arguments[i];
				if(key instanceof RegExp) regexp_keys[""+key] = def;
				else normal_keys[""+key] = def;
			}
		}
	}
	this.add = add; 

	this.remove = function remove(key, def){
		if(key instanceof RegExp){ 
			delete regexp_keys[""+key];
		}else{ 
			if(normal_keys[""+key]){
				delete normal_keys[""+key];
			}else if(testRegExp(key)){
				delete regexp_keys[""+key];
			}
		}
	}
	
	this.merge = function merge(other){
		if(!(other instanceof Dictionary)) other = new Dictionary(other);
		var i=0,
			keys = other.keys(),
			l=keys.length,
			key;
		for(;i<l;i++ ){
			key = keys[i];
			this.add(key, other.definitionOf(key));
		}
	}
}

/*


var arr = [
    [/abc/,"hh","a","b", "une regexp"],
    ["foo","bar"],
     ["baz","ooka"],
  ];
d = new Dictionary(arr);
d.keys()
 d.definitionOf(/fabc/)
  d.remove("hh")
  d.asArray();

*/
 
 

function NodePath(node){
	
	var cur = node;
	if(cur){
		this.unshift(cur);
		while(cur.parentNode){
			cur = cur.parentNode;
			this.unshift(cur);
		}
	}
	
	this.common = function common(other){
		if(!(other instanceof NodePath)){
			other = new NodePath(other);
		}
		var res = [],
			l_min = Math.min(this.length, other.length),
			i=0;
		while(i<l_min){
			if(this[i] === other[i]){
				res.push(this[i]);
			}else{
				break;
			}
			i++;
		}
		if(res.length) return new NodePath(res[res.length-1]);
		return new NodePath();
	}
	
	this.root = function root(){
		return this[0];
	}
	
	this.leaf = function root(){
		return this[this.length-1];
	}
	this.isSubPathOf = function isSubPathOf(other){
		var common = this.common(other);
		return common.length==other.length;
	}
	
	this.isPrefixOf = function isPrefixOf(other){
		var common = this.common(other);
		return common.length==this.length;
	}
}
NodePath.prototype=new Array();



;var dico = (function(){
	"use strict";

		var defaults  =  {
		
		match_class : "dico-match",
		match_prefix : "",
		match_suffix : "*",
		match_element : "span",
		match_set_title : true,
		match_case_sensitively : false,

		is_parsable_callback : default_is_parsable_callback,
		matches_callback : default_matches_callback,

		name:"dico",

		match_data : "dico",
		
		match_data_token : "token",
		match_data_definition : "definition",
		match_data_original : "original",
		
		matches_suffix : "matches",
	
		// /\w/ lacks support of non-ascii characters and "-"
		// here's latin1, and we dont support "_"
		match_character_regexp : /[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\-]/,
				
	};
	
	function walkAsync(node, processNode,  memo,  done){
	"use strict";
	
	memo = memo || {};
	done = done || function(){};
	done.pendingOps = done.pendingOps || 0;

	if(processNode(node, memo)) {
		var children = node.childNodes;
		for (var i=0; i<children.length ; i++){
			// increment pending ops  count
			done.pendingOps++;		
			// asynchronous recursion, for deeeeeeeeply nested documents		
			setTimeout((function(child, processNode, memo, done){
				return function(){ 
					walkAsync(child, processNode, memo, done); 
				};
			})(children[i], processNode, memo, done), 0);
		}
	}

	// fire done "events" if necessary
	done.pendingOps--;
	if(done.pendingOps===0){ 
		done(memo);
	}
	
}
		// DEPS wamkAsync
	// DEPS parseText
	// DEPS default_is_parsable_callback
	
	function parse(node, dictionary, options, onReady){
		"use strict";
		
		options = options || {};
		onReady = onReady || function(){};
		
		var memo = {
				options:options,
				dictionary:dictionary
		};		

		walkAsync(node, processNode, memo,  onReady);
				
		function supa(node, options){
			return function(){
				return default_is_parsable_callback(node, options);
			}
		}
			
		function processNode(node, memo){
			// text node, we parse for dict tokens, no further recursion	
			if(node.nodeType == 3){ 
				parseText(node, memo);
				return false;
			// elements node, look recursively for text nodes in children
			// if elements not blacklisted	
			}else if(node.nodeType == 1){ 
				return memo.options.is_parsable_callback(node, memo.options, supa);
			}
			// other types of nodes (comments...) : skip 'em
			return false;
		}
		
		
		
		return {
			"undo" : undo
		};
	}
		// encapsulates match in an element with a class name and optionaly the title
	function default_matches_callback(match, dict_key, dict_def, options){
		"use strict";
		var elt = document.createElement(options.match_element);
		elt.className = options.match_class;
		if(options.match_set_title) elt.title = dict_def;
		elt.appendChild(document.createTextNode(options.match_prefix + match + options.match_suffix));
		return elt;
	};
		
	// exclude some sensibly irrelevent elements and allready treated ones
	function default_is_parsable_callback(element_node, options, original_callback){
		"use strict";
		var pre = "data-" + options.name +"-"+ options.match_data +"-";
		var origin = pre + options.match_data_original;
		return !element_node[origin] && !element_node.nodeName.match(/^(STYLE|SCRIPT|HEAD|TITLE|META|LINK)$/i)
	}
	
		function swap(old, neo){
		"use strict";

		return function(){
			old.parentNode && old.parentNode.replaceChild(neo,old);
		};
	}
	
function buildMarkup(node, matchesObj, dictionary, memo){
	"use strict";
	var dictionary = memo.dictionary  || [], 
		options = memo.options || {},
		text = node.nodeValue || "";
			
	if(!node.parentNode) return;
	
	var matchesArr = [];
	for(match in matchesObj){
		if(matchesObj.hasOwnProperty(match)){
			matchesArr.push(parseInt(match));
		}
	}
		
		
		
	
	// iterate matches in order of the text, so we can correctly injects remaining parts
	if(matchesArr.length>0){
		matchesArr.sort(function(a,b){return a-b;})
		var previousPosition = 0;
		for(var i = 0; i< matchesArr.length; i++){
			var position = matchesArr[i];
			var dict_key = matchesObj[position][0];
			
			// rebuild text node for portion of text before matches
			var previousText = document.createTextNode(text.substring(previousPosition,position));
			node.parentNode.insertBefore(previousText,node);
			
			// build some node for the match and apend it
			var match = matchesObj[position][1],
				dict_def = dictionary[matchesObj[position][2]][1],
				insert = options.matches_callback(match, dict_key, dict_def, options);
			
			var parseName = "data-" + options.name +"-"+ options.match_data,
				pre = parseName +"-";
			insert[pre + options.match_data_original] = match;
			insert[pre + options.match_data_token] = dict_key;
			insert[pre + options.match_data_definition] = dict_def;
			
			node.parentNode[parseName] = node.parentNode[parseName] || {};
			node.parentNode[parseName][match]=dict_key;
			
			var matchesData = "data-" + options.match_data + "-"+ options.matches_suffix;
			node.parentNode[matchesData] = node.parentNode[matchesData] || {};
			node.parentNode[matchesData][options.name] = 1+(node.parentNode[matchesData][options.name] || 0);
			
			
			node.parentNode.insertBefore(insert,node);	

			
			previousPosition = position + match.length;
		}
		// rebuild text node for remaing text and append it			
		var remainingText = document.createTextNode(text.substring(previousPosition,text.length));
		node.parentNode.insertBefore(remainingText,node);
		node.parentNode.removeChild(node);
	}
	
}
	
// DEPS buildMarkup
// node is a text element
function parseText(node, memo){
	"use strict";

	function iteratePositions(match, start, end, cb){
			var i = start;
			for(; i<end; i++){
				if(matchesObj.hasOwnProperty(i)){
					var oldMatch = 	matchesObj[i][1];							
					cb(match, oldMatch, i, text);
				}
			}
		}
	
	
	var dictionary = memo.dictionary  || [], 
		options = memo.options,
		text = node.nodeValue || "";
					
	var textLC = options.match_case_sensitively ? text : text.toLowerCase();
	var matchesObj = {
		// index_of_match_in_text : [ key , match] 
		
	};
	
	// for every dictionary word...
	for(var j =0; j< dictionary.length; j++){
		var key = dictionary[j][0];
		// search all matches in text and for each
		
		
		var match;
		var position = -1;
		if(key instanceof RegExp){
			match = key.exec(textLC);
			position = match ? match.index : -1;
			match = match ? match[0] : null;
		}else{
			position = textLC.indexOf(options.match_case_sensitively ? key : key.toLowerCase());
			if(position > -1) match = text.substr(position, key.length);
		}
		
		while(position>-1){
			// if the match is not in the middle of a word
			if(position==0 || key instanceof RegExp || !textLC.charAt(position-1).match(options.match_character_regexp)){
				var positionAfter = position + match.length;
				// if the match's end is not in the middle of a word
				if(positionAfter == textLC.length || key instanceof RegExp || !textLC.charAt(positionAfter).match(options.match_character_regexp)){
					// if we have allready a match for a shorter word in the span of the current match
					// we delete the shorter match				
					iteratePositions(match, position, position+key.length, function(match, oldMatch, i, text){
						if(match.length > oldMatch.length){
							delete matchesObj[i];
						}					
					});					

					// if we dont have allready a longer word match for the current match span...
					var allreadyBiggerOne = false;
					iteratePositions(match, 0, position, function(match, oldMatch, i, text){
						if(position + match.length < i+oldMatch.length){
							allreadyBiggerOne = true;
						}
					});

					// ...we record the current match
					if(!allreadyBiggerOne){
						matchesObj[position] = [key, match, j];
					}
				} 
			}
			// search for a new match after the current one
			if(key instanceof RegExp){
				if(key.global){
					match = key.exec(textLC);
					position = match !== null ? match.index : -1;
					match = match ? match[0] : null;
				
				}else{
					position =-1;
				}
			}else{
				position = textLC.indexOf(options.match_case_sensitively ? key : key.toLowerCase(), position+key.length);
				if(position > -1) match = textLC.substr(position, key.length);
			}
		}
	}

	buildMarkup(node, matchesObj, dictionary, memo);
}

	// DEPS on swap

function undo(options){
	"use strict";
	var all = document.getElementsByTagName("*"),
		i=0,
		l=all.length,
		cur,
		original,
		text_node;
	for(;i<l;i++){
		cur = all[i];


		var pre = "data-" + options.name +"-"+ options.match_data +"-";
		var origin = pre + options.match_data_original;

		original = cur && cur[origin];
		if(original){
			text_node = document.createTextNode(original);
			// asynchronus to avoid concurrent iteration and modification of node list
			// also ensures it wont be executed before parsing (asynchronously) ended
			setTimeout(swap(cur, text_node), 0);
			console.log(options.name);
			var opt_key =  "data-"+ options.match_data +"-" + options.matches_suffix;
			var matches = cur.parentNode[opt_key][options.name];
			if(matches>0) cur.parentNode[opt_key][options.name] = -matches;
		}
	}
};
	var dictionaries = {};

function addDictionary(name, dict){
	if(!dictionaries[name]) dictionaries[name] = new Dictionary();
	dictionaries[name].merge(dict);
}

function getDictionary(name){
	return dictionaries[name] || null;
}


function is_node(node){
	return (node && node.nodeType !== undefined);
}

function dico(/*node, dictionary, options, done*/){
	var i=0,
		arg,
		node,
		dictionary,
		options,
		done,
		name;
	for(;i<arguments.length;i++){
		arg=arguments[i];
		if(arg && arg.constructor && /^String/.test(arg.constructor.name)){
			name = arg; 
		}else if(arg && arg.constructor && (/^Array/.test(arg.constructor.name) || arg instanceof Dictionary)){
			dictionary = arg;
		}else if(arg && arg.constructor && /^Function/.test(arg.constructor.name)){
			done = arg;
		}else if(is_node(arg)){
			node = arg;
		}else{
			options = arg;
		}
	}

	
	options = options || {};
	if(name) options.name = name;
	
	if(!node) node = document.body;
	
	var opt;
	for(opt in dico.config){
		if(options[opt] === undefined){
			options[opt] = dico.config[opt];
		}
	}

	if(dictionary){
		addDictionary(options.name, dictionary);
		parse(node, getDictionary(options.name).asArray(), options, done);
		var undome = (function(options){
			return function (){
				undo(options);
			};
		})(options);
		
		return {
			undo:undome,
		};
	
	}else{
		var undoit = (function(options){
			return function (){
				undo(options);
			};
		})(options);
		
		return {
			undo:undoit,
		};
		
	}
	
};
	
	dico.config = defaults;

	return dico;

})();

