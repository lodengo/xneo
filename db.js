var util = require("./util.js");
var basex = require('simple-basex');
var _db = new basex.Session({
	host : 'localhost',
	port : 1984,
	username : 'admin',
	password : 'admin'
});

var db = module.exports = function db() {

};

db._exec = function(func, args, callback) {
	function str(arg) {
		if (typeof arg !== 'string') {
			return arg;
		} else {
			if (arg[0] === '<' && arg.slice(-1) === '>') {
				return arg;
			} else {
				return "'" + arg + "'";
			}
		}
	}
	if (typeof args === 'function' && typeof callback === 'undefined') {
		callback = args;
		args = null;
	}

	var query = "import module namespace cost = 'cost'; cost:" + func + "(";

	var params = "";
	if (typeof args === 'undefined' || args === null) {

	} else if (typeof args === 'object') {
		var vs = [];
		Object.keys(args).forEach(function(k) {
			vs.push(str(args[k]));
		});
		params = vs.join(',');
	} else {
		params = str(args);
	}

	query = query + params + ")";
	console.dir(query);

	_db.query(query, function(err, result) {
		if (err)
			console.dir(err);	
		var result = util.xml2json(result); 
		var key = Object.keys(result)[0];
		var data = result[key];
		console.log(data);
		callback && callback(err, data);
	});
}

db.insertCost = function(data, file, parentId, callback) {
	if(parentId){
		this._exec('insertCost', [util.json2xml({cost : data}), file, parentId], callback);
	}else{
		this._exec('createFile', util.json2xml({cost : data}), callback);
	}	
}

db.feesToFlushOnCostCreate = function(file, id, callback){
	this._exec('feesToFlushOnCostCreate', [file, id], callback);
}

db.createRefsTo = function(file, fromFeeId, toIds, callback){
	this._exec('createRefsTo', [file, fromFeeId, toIds], callback);
}

db.removeRefsTo = function(file, fromFeeId, toIds, callback){
	this._exec('removeRefsTo', [file, fromFeeId, toIds], callback);
}

db.getRefedToIdsOfFee = function(file, fromFeeId, callback){
	this._exec('getRefedToIdsOfFee', [file, fromFeeId], function(err,data){
		if(! data.refTo){
			callback(err, []);
		}else{
			callback(err, [].concat(data.refTo));
		}			
	});
}

db.setFeeResult = function(file, feeId, result, callback){
	this._exec('setFeeResult', [file, feeId, result], callback);
}

db.getFee = function(file, id, callback){
	this._exec('getFee', [file, id], callback);
}

db.getRefToIdsOf = function(file, ids, callback){
	this._exec('getRefToIdsOf', [file, ids], callback);
}
////////////////////////////////////////////////////////////
db._C = function(file, costId, prop, getId, callback){
	this._exec('_C', [file, costId, prop], function(err, data){
		var values = getId? data.id : data.value;
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}

db._CF = function(file, costId, feeName, getId, callback) {
	this._exec('_CF', [file, costId, feeName], function(err, data){	
		var values = getId? data.id : data.value;		
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}


db._CC = function(file, costId, type, prop, getId, callback) {
	this._exec('_CC', [file, costId, type, prop], function(err, data){
		var values = getId? data.id : data.value;
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}

db._CCF = function(file, costId, type, feeName, getId, callback) {
	this._exec('_CCF', [file, costId, type, feeName], function(err, data){
		var values = getId? data.id : data.value; 		
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}

db._CS = function(file, costId, prop, getId, callback) {
	this._exec('_CS', [file, costId, prop], function(err, data){
		var values = getId? data.id : data.value;
		values = typeof values == 'object'? [] : [].concat(values);		
		callback(err, values);
	});
}

db._CSF = function(file, costId, feeName, getId, callback) {
	this._exec('_CSF', [file, costId, feeName], function(err, data){
		var values = getId? data.id : data.value;
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}

db._CAS = function(file, costId, prop, getId, callback) {
	this._exec('_CAS', [file, costId, prop], function(err, data){
		var values = getId? data.id : data.value;
		values = typeof values == 'object'? [] : [].concat(values);
		callback(err, values);
	});
}