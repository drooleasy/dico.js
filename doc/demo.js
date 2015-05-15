dico.config.is_parsable_callback = function(element, options, supa){
	/*console.log("my configured is_parsable - supa");
	console.log(supa());
	console.log("my configured is_parsable - nodeName");
	console.log(element.nodeName);
	console.log(!element.nodeName.match(/^(CODE|PRE)$/i));*/
	return supa() && !element.nodeName.match(/^(CODE|PRE)$/i);
}


function demo(){

	var dict_base = [
		["words", "I'am a word and I'am decorated by JavaScript"],
		["or phrases", "I'am a phrase and I'am decorated by JavaScript"],
		[/[Rr]eg[eE]xp/g, "I'am a regexp match and I'am decorated by JavaScript"],
		
	];




	dico(document.body, dict_base)


	var dict_dsbl = [
		['dictionaries', 'A dictionary is an array of arrays of pairs key/definition.'],
		['dictionary', 'A dictionary is an array of arrays of pairs key/definition.'],
	];

	var dsbl = null;
	var dsbl_opt = {
		match_class:"dsbl-match", // dico-match
		match_element:"code", // span
		match_suffix:"", // *
		match_data_token : "dsbl-token",
		match_data_original : "dsbl-original",
		match_data_definition : "dsbl-definition",

	};
	var dsbl_rgx = /\bdisabled\b/, dsbl_cname = "disabled"
	enable_dict = function enable_dict(){
		var enable_btn = document.getElementById('enable-dict');
		var disable_btn = document.getElementById('disable-dict');
		if(!enable_btn.className.match(dsbl_rgx)){
			enable_btn.className += " " + dsbl_cname;
			disable_btn.className = disable_btn.className.replace(dsbl_rgx, "");
			dsbl = dico(document.body, dict_dsbl, dsbl_opt);
		}
		return false;
	};
	disable_dict = function disable_dict(){
		var enable_btn = document.getElementById('enable-dict');
		var disable_btn = document.getElementById('disable-dict');
		if(!disable_btn.className.match(dsbl_rgx)){
			disable_btn.className += " " + dsbl_cname;
			enable_btn.className = enable_btn.className.replace(dsbl_rgx, "");
			dsbl.undo();
		}
		return false;
	};


	var dict_bigwin = [
		["match","'match' wins over 'at'"],
		["at","'at' would have loose in 'match'"],
		["tip","'tip' would have loose in 'multiple'"],
		["multiple","'multiple' wins over 'tip'"],
	];

	dico(document.body, dict_bigwin, {
		match_class:"bigwin-match", 
		match_prefix:"[",
		match_suffix:"]",
		match_element:"code"
	});




	var opt_custom = {
		match_class:"mymatch", // dico-match
		match_element:"strong", // span
		match_prefix:"::", // ""
		match_suffix:"::", // *
		match_case_sensitively:true, // false
		match_set_title:true, // true
		smatch_character_regexp : /\w/,
		match_only_first : false,
		match_data_token : "custom-token",
		match_data_original : "custom-original",
		match_data_definition : "custom-definition",
	};

	var dict_custom = [
		["customize","you can customize pretty much everything"],
		["name","you can customize pretty much everything"],
		["class","you can customize pretty much everything"],
		["prefix","you can customize pretty much everything"],
		["suffix","you can customize pretty much everything"],
		["title","you can customize pretty much everything"],
		
	];

	dico(document.getElementById("custom"), dict_custom, opt_custom);




	var builder_dict = [
		["custom element builder function","those are custom rendering callback, here we render as dl/dt/dd"]
	];
	var builder_opt = {
		matches_callback: function my_match_cb(match, dict_key, dict_def){
			var dl = document.createElement("dl");
			var dt = document.createElement("dt");
			var dd = document.createElement("dd");
			dd.className = "custom-builder";
			dt.appendChild(document.createTextNode(match));
			dd.appendChild(document.createTextNode(dict_def));
			dl.appendChild(dt);
			dl.appendChild(dd);
			return dl;
		}
	};

	dico(document.body, builder_dict, builder_opt);

	var restrain_dict = [
		["restrain","this word wasnt matched in the previous paragraph"]
	];
	var restrain_opt = {
		matches_callback: function my_match_cb(match, dict_key, dict_def){
			var span = document.createElement("span");
			span.className = "restrain-match";
			var suup = document.createElement("sup");
			span.appendChild(document.createTextNode(match));
			suup.appendChild(document.createTextNode(dict_def));
			span.appendChild(suup);
			return span;
		}
	};

	dico(document.getElementById("restrain"), restrain_dict, restrain_opt);


	var qtip_dict = [
		["jquery", "Do you know this ?"],
		["qtip", "Do you know that ?"],
	];

	//console.log("launch qtip-dict");
	dico(document.body, qtip_dict, {match_class:"qtip-match"}, function onReady(){
		//console.log("ready cb qtip");
		$(".qtip-match").qtip();
		//console.log($(".qtip-match").size());
	});

}

var evil_opt = {
	match_data_original:"evil",
	matches_callback: function my_match_cb(match, dict_key, dict_def){
		var span = document.createElement("span");
		span.className = "evil-match";
		var suup = document.createElement("sup");
		span.appendChild(document.createTextNode(match));
		suup.appendChild(document.createTextNode(dict_def));
		span.appendChild(suup);
		return span;
	}

};

var evil = dico(document.body, [
	["this library", "this library"],
	["markup", "markup"],
	["dictionaries", "dictionaries"],
	["matches", "matches"],
], evil_opt, function() {
	$(".evil-match").css("position", "relative")
		.animate({"font-size":"1.6em", "color":"#3A3"}, 300)
		.animate({"font-size":"1.6em"}, 700)
		.animate({"font-size":"1em","color":"#000"}, 1000, function(){evil.undo(); demo();})
	$(".evil-match sup")
		.animate({"font-size":"1.6em"}, 600)
		.animate({"font-size":"1.2em"}, 200)
		.animate({"font-size":"1.6em"}, 200)
		.animate({"font-size":"1.2em"}, 200)
		.animate({"font-size":"1.6em", "opacity":1}, 200)
		//.delay(60000)
		.animate({"font-size":"0em", "opacity":0}, 400 );
});
