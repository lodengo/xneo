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

Fee.get = function(file, id, callback){
	db.getFee(file, id, function(err,doc){
		callback(err, new Fee(doc));
	});
}

Fee.prototype.createRefTo = function(toIds, callback){
	if(toIds.length == 0){
		return callback();
	}
	var fromFeeId = this.id;
	var fromCostId = this.costId;
	var file = this.file;
	db.createRefsTo(file, fromFeeId, util.json2xml({ids:{id:toIds}}), callback);		
}

Fee.prototype.removeRefsTo = function(toIds, callback){
	if(toIds.length == 0){
		return callback();
	}
	var fromFeeId = this.id;
	var file = this.file;
	db.removeRefsTo(file, fromFeeId, util.json2xml({ids:{id:toIds}}), callback);	
}

Fee.prototype.refedToIds = function(callback){
	var fromFeeId = this.id;
	var file = this.file;
	db.getRefedToIdsOfFee(file, fromFeeId, callback);	
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
	me.refedToIds(function(err, refedToIds){ 
		me.refToIdsByExpr(function(err, refToIdsByExpr){	
			console.log(['ref', me.feeName, refedToIds, refToIdsByExpr]);			
			me.removeRefsTo(refedToIds.diff(refToIdsByExpr), function(err){
				me.createRefTo(refToIdsByExpr.diff(refedToIds), callback);
			});
		});
	});
}