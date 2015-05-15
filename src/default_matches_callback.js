	// encapsulates match in an element with a class name and optionaly the title
	function default_matches_callback(match, dict_key, dict_def, options){
		var elt = document.createElement(options.match_element);
		elt.className = options.match_class;
		if(options.match_set_title) elt.title = dict_def;
		elt.appendChild(document.createTextNode(options.match_prefix + match + options.match_suffix));
		return elt;
	};
