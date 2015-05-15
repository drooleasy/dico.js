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
	
	
		// /\w/ lacks support of non-ascii characters and "-"
		// here's latin1, and we dont support "_"
		match_character_regexp : /[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\-]/,
				
	};
	
		function parseNode(node, dictionary, options, onReady){
		console.log(node);
		
		options = options || {};
		onReady = onReady || function(){};
		var opt;
		
		
		for(opt in parseNode.config){
			if(options[opt] === undefined){
				options[opt] = parseNode.config[opt];
				//console.log("opt  " + opt);
				//console.log(opt);
			}
		}
		onReady.pendingOps = onReady.pendingOps || 0;
	
		if(node.nodeType == 3){ // text node, we parse for dict tokens, no further recursion
			parseText(node, dictionary, options);
		}else if(node.nodeType == 1 && 
				options.is_parsable_callback(node, options, function(){
					//console.log("supa called");
					return default_is_parsable_callback(node, options);
					
				})){ // elements node, look recursively for text nodes in children
			var children = node.childNodes;
			for (var i=0; i<children.length ; i++){
				// asynchronous recursion, for deeeeeeeeply nested documents
				onReady.pendingOps++;
				setTimeout((function(target, dic, options){
					return function(){ 
						parseNode(target, dic, options, onReady); 
					};
				})(children[i], dictionary, options), 0);
			}
		}
		onReady.pendingOps--;
		if(onReady.pendingOps===0){ 
			//console.log("ready");
			onReady();
		}
		// other types of nodes (comments...) : skip 'em
		
		
		var undo = function(){
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
					// console.log(original);
					text_node = document.createTextNode(original);
					// asynchronus to avoid concurrent iteration and modification of node list
					// also ensures it wont be executed before parsing (asynchronously) ended
					setTimeout(swap(cur, text_node), 0);
				}
			}
		};
		
		return {
			"undo" : undo
		};
	}
		// encapsulates match in an element with a class name and optionaly the title
	function default_matches_callback(match, dict_key, dict_def, options){
		var elt = document.createElement(options.match_element);
		elt.className = options.match_class;
		if(options.match_set_title) elt.title = dict_def;
		elt.appendChild(document.createTextNode(options.match_prefix + match + options.match_suffix));
		return elt;
	};
		
	// exclude some sensibly irrelevent elements and allready treated ones
	function default_is_parsable_callback(element_node, options, original_callback){
		
		var pre = "data-" + options.name +"-"+ options.match_data +"-";
		var origin = pre + options.match_data_original;
		return !element_node[origin] && !element_node.nodeName.match(/^(STYLE|SCRIPT|HEAD|TITLE|META|LINK)$/i)
	}
	
		function swap(old, neo){
		return function(){
			old.parentNode && old.parentNode.replaceChild(neo,old);
		};
	}
		// node is a text element
	function parseText(node, dictionary, options){
		var text = node.nodeValue || "";
		dictionary = dictionary || [];
						
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
						for(var ii=position; ii<position+key.length; ii++){
							if(matchesObj.hasOwnProperty(ii)){
								var oldMatch = 	matchesObj[ii][1];
								if(match.length > oldMatch.length){
									delete matchesObj[ii];
								}
							}
						}
						// if we dont have allready a longer word match for the current match span...
						var allreadyBiggerOne = false;
						for(var jj=0; jj<position;jj++){
							if(matchesObj.hasOwnProperty(jj)){
								var oldMatch = 	matchesObj[jj][1];
								if(position + match.length < jj+oldMatch.length){
									allreadyBiggerOne = true;
									break;
								}
							}
						}
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
		
		
		
		
		var matchesArr = [];
		for(match in matchesObj){
			if(matchesObj.hasOwnProperty(match)){
				matchesArr.push(parseInt(match));
			}
		}
		
		if(!node.parentNode) return;
		
		// iterate matches in order of the text, so we can correctly injects remaining parts
		if(matchesArr.length>0){
			//console.log(matchesObj);
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
				
				var pre = "data-" + options.name +"-"+ options.match_data +"-";
				insert[pre + options.match_data_original] = match;
				insert[pre + options.match_data_token] = dict_key;
				insert[pre + options.match_data_definition] = dict_def;
				
				node.parentNode.insertBefore(insert,node);	

				
				previousPosition = position + match.length;
			}
			// rebuild text node for remaing text and append it			
			var remainingText = document.createTextNode(text.substring(previousPosition,text.length));
			node.parentNode.insertBefore(remainingText,node);
			node.parentNode.removeChild(node);
		}
	}

	
	parseNode.config = defaults;

	return parseNode;

})();

