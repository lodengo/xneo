var async = require('async');
var util = require("./util.js");
var db = require("./db.js");

var Ref = module.exports = function Ref(fee) {	
	this._fee = fee;	
}

Ref.prototype.refToIdsByExpr = function(callback){
	var me = this;
	var feeExpr = me._fee.feeExpr;
	var matches = feeExpr.match(util.refReg) || [];
	
	async.concat(matches, function(str, cb){
		var i = str.indexOf("(");
		if(i != -1 && str[str.length-1] == ')'){
			var func = str.substr(0, i);
			var args = str.substr(i+1, str.length-i-2).split(',');
			
			args.push(cb);
			me[func].apply(me, args); 	
		}else{
			cb(null, []);
		}
	}, function(err, nodes){callback(err, nodes.unique());});
}

Ref.prototype.f = function(pName, callback){
	callback(null, []);
}

Ref.prototype.c = function(pName, callback){	
	var costId = this._fee.costId;
	callback(null, [costId]);
}

Ref.prototype.cf = function(feeName, callback){	
	var costId = this._fee.costId;
	var file = this._fee.file;
	db._CF(file, costId, feeName, true, callback);	
}

Ref.prototype.cc = function(costType, pName, callback){
	var costId = this._fee.costId;
	var file = this._fee.file;
	db._CC(file, costId, costType, pName, true, callback);			
}

Ref.prototype.ccf = function(costType, feeName, callback){
	var costId = this._fee.costId;
	var file = this._fee.file;
	db._CCF(file, costId, costType, feeName, true, callback);	
}

Ref.prototype.cs = function(prop, callback){
	var costId = this._fee.costId;	
	var file = this._fee.file;
	db._CS(file, costId, prop, true, callback);		
}

Ref.prototype.csf = function(feeName, callback){
	var costId = this._fee.costId;
	var file = this._fee.file;
	db._CSF(file, costId,  feeName, true, callback);	
}

Ref.prototype.cas = function(prop, callback){
	var costId = this._fee.costId;
	var file = this._fee.file;
	db._CAS(file, costId,  prop, true, callback);	
}