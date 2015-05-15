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
