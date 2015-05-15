
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
