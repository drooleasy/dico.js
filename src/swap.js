	function swap(old, neo){
		"use strict";
		return function(){
			old.parentNode && old.parentNode.replaceChild(neo,old);
		};
	}
