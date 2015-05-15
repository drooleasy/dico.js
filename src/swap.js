	function swap(old, neo){
		return function(){
			old.parentNode && old.parentNode.replaceChild(neo,old);
		};
	}
