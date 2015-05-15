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
