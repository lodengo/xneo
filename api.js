var async = require('async');
var Cost = require("./cost.js");
//var Fee = require("./fee.js");
//var Calc = require("./calc.js");
var util = require("./util.js");
//var db = require("./db.js");

var Api = module.exports = function Api() {

}

//////////////////////////////////////////////////////////
Api._flushFees = function(fees, callback){
	callback();
};

Api.createCost = function(data, file, parentId, callback) {
	var me = this;
	Cost.create(data, file, parentId, function(err, cost) {
		cost.feesToFlushOnCreate(function(err, fees){
			me._flushFees(fees, function(err, res){
				callback(err, cost);
			});
		});		
	});
}