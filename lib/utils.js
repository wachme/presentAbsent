module.exports.matchAll = function(re, s, callback, done) {
    var re = (typeof re === RegExp) ? re : new RegExp(re);
    var n = 0;
    while(m = re.exec(s))
        callback(m, n++);
    if(done)
        done();
};

module.exports.params = function(obj) {
	var s = '';
	for(key in obj)
		s += key + '=' + encodeURIComponent(obj[key]) + '&';
	return s.substring(0, s.length - 1);
};
