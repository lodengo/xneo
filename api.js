var async = require('async');
var Cost = require("./cost.js");
var Fee = require("./fee.js");
var Calc = require("./calc.js");
var util = require("./util.js");

var Api = module.exports = function Api() {
	
}

//////////////////////////////////////////////////////////
Api._flushFees = function(file, fees, callback){
	async.map(fees, function(fee, cb) {			
		fee.buildRef(function(err, res) {
			cb(err, fee.id);
		});
	}, function(err, ids) {		
		Calc.start(file, ids, function(err, res) {
			callback(err);
		});						
	});
};

Api.createCost = function(data, file, parentId, callback) {
	var me = this;
	Cost.create(data, file, parentId, function(err, cost) {
		file = file || cost.file;
		cost.feesToFlushOnCreate(function(err, fees){
			me._flushFees(file, fees, function(err, res){
				callback(err, cost);
			});
		});		
	});
}