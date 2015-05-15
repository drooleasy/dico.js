;var dico = (function(){
	"use strict";


	<?php require_once("default.js") ?>
	<?php require_once("parseNode.js") ?>
	<?php require_once("default_matches_callback.js") ?>
	<?php require_once("default_is_parsable_callback.js") ?>
	<?php require_once("swap.js") ?>
	<?php require_once("parseText.js") ?>
	
	parseNode.config = defaults;

	return parseNode;

})();

