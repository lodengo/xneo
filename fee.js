var async = require('async');
var Ref = require("./ref.js");
var util = require("./util.js");
var db = require("./db.js");

var Fee = module.exports = function Fee(_node) {
	this._node = _node;	
}

Object.defineProperty(Fee.prototype, 'file', {
	get : function() {
		return this._node.file;
	}
});

Object.defineProperty(Fee.prototype, 'costId', {
	get : function() {
		return this._node.costId;
	}
});

Object.defineProperty(Fee.prototype, 'costType', {
	get : function() {
		return this._node.costType;
	}
});

Object.defineProperty(Fee.prototype, 'id', {
	get : function() {
		return this._node.id;
	}
});

Object.defineProperty(Fee.prototype, 'feeName', {
	get : function() {
		return this._node.feeName;
	}
});

Object.defineProperty(Fee.prototype, 'feeExpr', {
	get : function() {
		return this._node.feeExpr+"";
	}
});

Object.defineProperty(Fee.prototype, 'feeResult', {
	get : function() {
		return this._node.feeResult;
	},
	set: function (result) {
		this._node.feeResult = result;
	}
});

Object.defineProperty(Fee.prototype, 'refTo', {
	get : function() {
		var to = this._node.refTo;
		return to ? [].concat(to) : [];
	}
});

Object.defineProperty(Fee.prototype, 'refFrom', {
	get : function() {
		var from = this._node.refFrom;
		return from ? [].concat(from) : [];
	}
});

Fee.prototype.feesToFlushOnCreate = function(callback) {
	
}

Fee.prototype.feesToFlushOnUpdate = function(key, value, callback) {
	
}

Fee.prototype.feesToFlushOnDelete = function(callback) {
	
}

Fee.get = function(file, id, callback){
	db.getFee(file, id, function(err,doc){
		callback(err, new Fee(doc));
	});
}

Fee.gets = function(file, ids, callback){
	db.getFees(file, util.json2xml({ids:{id:ids}}), function(err,doc){
		var nfees = doc.fee;
		async.map(nfees, function(nfee, cb){cb(err, new Fee(nfee));}, callback);
	});
}

Fee.prototype.createRefTo = function(toIds, callback){
	var me = this;
	if(toIds.length == 0){
		return callback();
	}
	var fromFeeId = this.id;
	var fromCostId = this.costId;
	var file = this.file;
	db.createRefsTo(file, fromFeeId, util.json2xml({ids:{id:toIds}}), function(err, res){
		me._node.refTo = me._node.refTo ? me._node.refTo.concat(toIds) : toIds;
		callback(err, res);
	});		
}

Fee.prototype.removeRefsTo = function(toIds, callback){
	var me = this;
	if(toIds.length == 0){
		return callback();
	}
	var fromFeeId = this.id;
	var file = this.file;
	db.removeRefsTo(file, fromFeeId, util.json2xml({ids:{id:toIds}}), function(err, res){
		toIds.forEach(function(id){
			var idx = me._node.refTo.indexOf(id);
			if(idx != -1){
				me._node.refTo.splice(idx, 1);
			}
		});
		callback(err, res);
	});	
}

Fee.prototype.refToIdsByExpr = function(callback){
	var me = this;
	var ref = new Ref(me);
	ref.refToIdsByExpr(function(err, nodes){
		callback(err, nodes);
	});
}

Fee.prototype.buildRef = function(callback){
	var me = this;	
	var refedToIds = me.refTo;
	me.refToIdsByExpr(function(err, refToIdsByExpr){	
		//console.log(['ref', me.costType, me.feeName, refedToIds, refToIdsByExpr]);			
		me.removeRefsTo(refedToIds.diff(refToIdsByExpr), function(err){
			me.createRefTo(refToIdsByExpr.diff(refedToIds), callback);
		});
	});	
}

Fee.prototype.update = function(prop, value, callback){
	
}

Fee.prototype.del = function(callback){
	
}