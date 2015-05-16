var dictionaries = {};

function addDictionary(name, dict){
	if(!dictionaries[name]) dictionaries[name] = new Dictionary();
	dictionaries[name].merge(dict);
}

function getDictionary(name){
	return dictionaries[name] || null;
}


function is_node(node){
	return (node && node.nodeType !== undefined);
}

function dico(/*node, dictionary, options, done*/){
	var i=0,
		arg,
		node,
		dictionary,
		options,
		done,
		name;
	for(;i<arguments.length;i++){
		arg=arguments[i];
		if(arg && arg.constructor && /^String/.test(arg.constructor.name)){
			name = arg; 
		}else if(arg && arg.constructor && (/^Array/.test(arg.constructor.name) || arg instanceof Dictionary)){
			dictionary = arg;
		}else if(arg && arg.constructor && /^Function/.test(arg.constructor.name)){
			done = arg;
		}else if(is_node(arg)){
			node = arg;
		}else{
			options = arg;
		}
	}

	
	options = options || {};
	if(name) options.name = name;
	
	if(!node) node = document.body;
	
	var opt;
	for(opt in dico.config){
		if(options[opt] === undefined){
			options[opt] = dico.config[opt];
		}
	}

	if(dictionary){
		addDictionary(options.name, dictionary);
		parse(node, getDictionary(options.name).asArray(), options, done);
		var undome = (function(options){
			return function (){
				undo(options);
			};
		})(options);
		
		return {
			undo:undome,
		};
	
	}else{
		var undoit = (function(options){
			return function (){
				undo(options);
			};
		})(options);
		
		return {
			undo:undoit,
		};
		
	}
	
};
