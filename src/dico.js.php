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
	<?php require_once("dico_main.js"); ?>
	
	dico.config = defaults;

	return dico;

})();

