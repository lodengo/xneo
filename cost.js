var async = require('async');
var util = require("./util.js");
var Fee = require("./fee.js");
var db = require("./db.js");

var Cost = module.exports = function Cost(_node) {
	this._node = _node;
}

Object.defineProperty(Cost.prototype, 'id', {
	get : function() {
		return this._node.id;
	}
});

Object.defineProperty(Cost.prototype, 'file', {
	get : function() {
		return this._node.file;
	}
});

Object.defineProperty(Cost.prototype, 'type', {
	get : function() {
		return this._node.type;
	}
});

// fees need rebuild ref and calc on create: fees of cost && parent fees with cc
// && sibling fees with cs
Cost.prototype.feesToFlushOnCreate = function(callback) {
	var file = this.file;
	var id = this.id;
	
	db.feesToFlushOnCostCreate(file, id, function(err, fees){
		fees = [].concat(fees.fee);
		fees = fees.map(function(f){
			return new Fee(f);
		}); 
		callback(err, fees);
	});
}

Cost.create = function(data, file, parentId, callback) {
	db.insertCost(data, file, parentId, function(err, data) {
		var node = {
			id : data.id,
			file : data.file || file,
			type: data.type
		};
		callback(err, new Cost(node));
	});
};
