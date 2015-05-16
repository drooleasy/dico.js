<?php require_once("Dictionary.js") ?>
<?php require_once("NodePath.js") ?>



;var dico = (function(){
	"use strict";

	<?php require_once("default.js") ?>
	<?php require_once("walkAsync.js") ?>
	<?php require_once("parse.js") ?>
	<?php require_once("default_matches_callback.js") ?>
	<?php require_once("default_is_parsable_callback.js") ?>
	<?php require_once("swap.js") ?>
	<?php require_once("buildMarkup.js") ?>
	<?php require_once("parseText.js") ?>
	<?php require_once("undo.js") ?>
	

/*

needs dict builder/manager

select : node?, name?


node is no

parsing : dicts, opt
-> add,remove dict
-> change opt
-> undo redo

on parsing change :
	undo node,name
	add new dict/opt
	reparse


node_path -> node?
name -> nodes
	
*/




	var dictionaries = {
		"dico" : new Dictionary(),	
	}
	
	function addDictionary(name, dict){
		if(!dictionaries[name]) dictionaries[name] = [];
		
	}



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

