
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

