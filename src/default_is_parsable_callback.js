	
	// exclude some sensibly irrelevent elements and allready treated ones
	function default_is_parsable_callback(element_node, options, original_callback){
		
		var pre = "data-" + options.name +"-"+ options.match_data +"-";
		var origin = pre + options.match_data_original;
		return !element_node[origin] && !element_node.nodeName.match(/^(STYLE|SCRIPT|HEAD|TITLE|META|LINK)$/i)
	}
	
