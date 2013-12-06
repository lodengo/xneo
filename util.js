// Compute the intersection of n arrays
Array.prototype.intersect = function() {
	if (!arguments.length)
		return [];
	var a1 = this;
	var a = a2 = null;
	var n = 0;
	while (n < arguments.length) {
		a = [];
		a2 = arguments[n];
		var l = a1.length;
		var l2 = a2.length;
		for (var i = 0; i < l; i++) {
			for (var j = 0; j < l2; j++) {
				if (a1[i] === a2[j])
					a.push(a1[i]);
			}
		}
		a1 = a;
		n++;
	}
	return a.unique();
};

// Return new array with duplicate values removed
Array.prototype.unique = function() {
	var a = [];
	var l = this.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++) {
			// If this[i] is found later in the array
			if (this[i] === this[j])
				j = ++i;
		}
		a.push(this[i]);
	}
	return a;
};

// Return elements which are in A but not in arg0 through argn
Array.prototype.diff = function() {
	var a1 = this;
	var a = a2 = null;
	var n = 0;
	while (n < arguments.length) {
		a = [];
		a2 = arguments[n];
		var l = a1.length;
		var l2 = a2.length;
		var diff = true;
		for (var i = 0; i < l; i++) {
			for (var j = 0; j < l2; j++) {
				if (a1[i] === a2[j]) {
					diff = false;
					break;
				}
			}
			diff ? a.push(a1[i]) : diff = true;
		}
		a1 = a;
		n++;
	}
	return a.unique();
};

//费用表达式引用关系
exports.refReg = new RegExp([ 'f', 'c', 'cf', 'cc', 'ccf', 'cs', 'csf', 'cas' ]
		.join('\\([^\\)]*\\)|')
		+ '\\([^\\)]*\\)', 'g');

// 费用表达式--计算扩展 see:
// https://github.com/josdejong/mathjs/blob/master/docs/extend.md
exports.math_extend = {
	sum : function(args) {
		var total = 0;
		var argsArray = arguments;
		Object.keys(argsArray).forEach(function(key) {
			total += argsArray[key];
		});
		return total;
	}
};

exports.xml2json = function xml2json(xml) {
	return require('xml2json').toJson(xml, {
        object: true,
        coerce: true,
        sanitize: false
    });
}

exports.json2xml = function json2xml(o, tab) {
    var toXml = function (v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
        } else if (typeof (v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        } else {
            xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
        }
        return xml;
    }, xml = "";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}