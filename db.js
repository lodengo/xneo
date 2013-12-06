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
		callback && callback(err, result[key]);
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