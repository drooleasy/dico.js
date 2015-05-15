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

