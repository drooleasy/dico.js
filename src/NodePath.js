
function NodePath(node){
	
	var cur = node;
	if(cur){
		this.unshift(cur);
		while(cur.parentNode){
			cur = cur.parentNode;
			this.unshift(cur);
		}
	}
	
	this.common = function common(other){
		if(!(other instanceof NodePath)){
			other = new NodePath(other);
		}
		var res = [],
			l_min = Math.min(this.length, other.length),
			i=0;
		while(i<l_min){
			if(this[i] === other[i]){
				res.push(this[i]);
			}else{
				break;
			}
			i++;
		}
		if(res.length) return new NodePath(res[res.length-1]);
		return new NodePath();
	}
	
	this.root = function root(){
		return this[0];
	}
	
	this.leaf = function root(){
		return this[this.length-1];
	}
	this.isSubPathOf = function isSubPathOf(other){
		var common = this.common(other);
		return common.length==other.length;
	}
	
	this.isPrefixOf = function isPrefixOf(other){
		var common = this.common(other);
		return common.length==this.length;
	}
}
NodePath.prototype=new Array();
