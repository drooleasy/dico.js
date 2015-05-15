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
		}
	}
};
