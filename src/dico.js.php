;var dico = (function(){
	"use strict";

	<?php require_once("default.js") ?>
	<?php require_once("walkAsync.js") ?>
	<?php require_once("parse.js") ?>
	<?php require_once("default_matches_callback.js") ?>
	<?php require_once("default_is_parsable_callback.js") ?>
	<?php require_once("swap.js") ?>
	<?php require_once("parseText.js") ?>
	<?php require_once("undo.js") ?>
	
	
	function dico(node, dictionary, options, done){
		options = options || {};
		var opt;
		for(opt in dico.config){
			if(options[opt] === undefined){
				options[opt] = dico.config[opt];
			}
		}
	
		parse(node, dictionary, options, done);

		var undome = (function(options){
			return function (){
				undo(options);
			};
		})(options);
		
		return {
			undo:undome,
		};
	};

	dico.config = defaults;

	return dico;

})();

