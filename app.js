var Api = require("./api.js");

function Tester() {
	this.file = ''; //cost file id
	this.ztgc = ''; // 整体工程id
	this.dxgc = []; // 单项工程ids
	this.dwgc = []; // 单位工程ids
	this.fbfx = []; // 分部分项ids
	this.qd = []; // 清单ids
	this.de = []; // 定额ids
	this.glj = []; // 工料机ids
}

Tester.prototype.createZtgc = function(callback) {
	var me = this;
	var ztgc = {
		type : '整体工程'
	};
	
	Api.createCost(ztgc, null, null, function(err, data) {
		me.file = data.file;
		me.ztgc = data.id;
		callback(err,data);
	});
}

Tester.prototype.createGlj = function(callback) {
	var me = this;
	var types = [ "人工", "材料", "机械" ];
	var glj = {
		'type' : types[Math.floor(Math.random() * 10) % 3],
		'单价' : Math.random() * 100,
		'含量' : Math.random()
	};	
	var parentId = me.ztgc;//me.de.random();
	if (!parentId) {
		return callback(null);
	}
	Api.createCost(glj, me.file, parentId, function(err, cost) {
		me.glj.push(cost.id);
		callback(err, cost);
	});
}
////////////////////////////////////////////////////////
function arrPush(arr, e, n) {
	if (n) {
		for (var i = 0; i < n; i++) {
			arr.push(e);
		}
	} else {
		arr.push(e);
	}
}

function step(actor, actions, i, callback) {
	if (i == actions.length) {
		callback();
	} else {
		var act = actions[i];
		console.log("step " + i + ": " + act);
		actor[act](function(err, res) {
			step(actor, actions, i + 1, callback);
		});
	}
}

function run(callback) {
	var actions = [ 'createZtgc' ];
//	arrPush(actions, "createDXgc", 2);
//	arrPush(actions, "createDwgc", 4);
//	arrPush(actions, "createFbfx", 8);

	
//	arrPush(ops, "createQd", 10);
//	arrPush(ops, "createDe", 20);
	arrPush(actions, "createGlj", 3);
	// arrPush(actions, "modGcl", 5);
	// arrPush(actions, "delNode", 2);

	//actions = actions.concat(ops.shuffle());

	var actor = new Tester();
	step(actor, actions, 0, callback);
}

 run(function() {
	 console.log('done');
	 //console.log(util.stats.info());
 });


