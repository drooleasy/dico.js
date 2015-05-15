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
