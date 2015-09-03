Array.prototype.avg = function() {
	var cnt = 1;
	var len = this.length;
	var av;
	if (this[0] instanceof Date) {
			av = this[0].getTime();
	} else {av = this[0]; }
	for (var i = 1; i < len; i++) {
		if (this[0] instanceof Date) {
			av += this[i].getTime();
		} else {av += this[i]; }
	    cnt++;
	}
	if (this[0] instanceof Date) {
		return new Date(av/cnt);
	}
	return av/cnt;
};