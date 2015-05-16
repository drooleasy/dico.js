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
		
		matches_suffix : "matches",
	
		// /\w/ lacks support of non-ascii characters and "-"
		// here's latin1, and we dont support "_"
		match_character_regexp : /[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\-]/,
				
	};
	
