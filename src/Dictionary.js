function Dictionary(dict){
	"use strict";
	
	var i=0,
		key=null,
		normal_keys = {},
		regexp_keys = {};
	dict = dict || [];
	if(dict.length){
		for(;i<dict.length;i++){
			if(dict[i].length && dict[i].length>1){
				add.apply(this, dict[i]);
			}
		}
	}
	
	function testRegExp(s){
		// note empty regexp is a comment and so does not exists)
		return /^\/.*[^\\]\/[img]{0,3}$/.test(s)
	}
	
	function parseRegExp(s){
		var match = /^\/(.*[^\\])\/([img]{0,3})$/.exec(s);
		if(!match) throw new SyntaxError("Not regexp string: "+s);
		return new RegExp(match[1], match[2]);
	}
	
	this.keys = function keys(){
		var res = [],
			k;
		for(k in normal_keys) res.push(k);
		for(k in regexp_keys) res.push(parseRegExp(k));
		return res;
	}
	
	this.definitionOf = function definitionOf(key){
		var res = null;
		if(key instanceof RegExp){ 
			res = regexp_keys[""+key];
		}else{
			res = normal_keys[key];
			if(res===undefined){
				if(testRegExp(key)){
					res = regexp_keys[""+key];
				}
			}
		}
		if(res===undefined) res = null;
		return res;
	}
	
	this.asArray = function(){
		var res=[],
			key;
		for(key in normal_keys){
			res.push([key, normal_keys[key]]);
		}
		for(key in regexp_keys){
			res.push([parseRegExp(key), regexp_keys[key]]);
		}
		return res;
	}
	function add(/* key, key2, ..., def */){
		var i=0,
			l=arguments.length-1,
			def = arguments[l],
			key;
		if(l>0){
			for(;i<l;i++){
				key = arguments[i];
				if(key instanceof RegExp) regexp_keys[""+key] = def;
				else normal_keys[""+key] = def;
			}
		}
	}
	this.add = add; 

	this.remove = function remove(key, def){
		if(key instanceof RegExp){ 
			delete regexp_keys[""+key];
		}else{ 
			if(normal_keys[""+key]){
				delete normal_keys[""+key];
			}else if(testRegExp(key)){
				delete regexp_keys[""+key];
			}
		}
	}
	
	this.merge = function merge(other){
		if(!(other instanceof Dictionary)) other = new Dictionary(other);
		var i=0,
			keys = other.keys(),
			l=keys.length,
			key;
		for(;i<l;i++ ){
			key = keys[i];
			this.add(key, other.definitionOf(key));
		}
	}
}

/*


var arr = [
    [/abc/,"hh","a","b", "une regexp"],
    ["foo","bar"],
     ["baz","ooka"],
  ];
d = new Dictionary(arr);
d.keys()
 d.definitionOf(/fabc/)
  d.remove("hh")
  d.asArray();

*/
 
 
