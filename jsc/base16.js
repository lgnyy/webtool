// 闭包执行一个立即定义的匿名函数
(function(factory) {

    //factory是一个函数，下面的target就是他的参数

    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        // [1] 支持在module.exports.abc,或者直接exports.abc
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        // [2] AMD 规范 
        //define(['exports'],function(exports){
           //    exports.abc = function(){}
        //});
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
		var self = (typeof(window) !== 'undefined')? window : this;
		var jsc = self['jsc'] || (self['jsc'] = {});
		return (jsc.base16)? jsc : factory(jsc); // 确保只包含一次
    }
}(function(target){
	
	var base16 = {};

	function _get_utf8_size(c){
		for (var i=0; i<7; i++){
			if (!(c & 0x80)){
				return i;
			}
			c = c << 1;
		}
		return 6;
	}

	function _unicode_to_utf8_encode(n){
		var s = "";
		var bits = 0;
		while(n > 0x3F){
			bits = 0x80 | (bits >> 1);			
			s = (0x80 + (n & 0x3F)).toString(16) + s;
			n = n >> 6;
		}
		return ( 0x80 | (bits >> 1) | n).toString(16) + s;
	}
	
	function _unicode_from_utf8_decode(n, cnt, b16str, offset){	
		n = n & (0xFF >> cnt);
		for (var j=1; j<cnt; j++){
			offset += 2;
			n = (n << 6) | (parseInt(b16str.substr(offset,2),16) & 0x3F);
		}
		return n;
	}

	function _num_encode_utf8(n){
		if (n < 0x100){
			return ((n < 16) && ('0' + n.toString(16))) || n.toString(16);
		}else{
			return _unicode_to_utf8_encode(n);
		}
	}
	function _num_encode_utf16_le(n){
		var s = (0x10000 + n).toString(16);
		return s.substring(3) + s.substring(1,3);
		
	}
	function _num_encode_utf16_be(n){
		return (0x10000 + n).toString(16).slice(1);
	}

	function _get_codepage(opts){
		var codepage = 0;
		if (opts && opts.charset){
			if ((opts.charset === 'UTF8') || (opts.charset === 'utf-8')){
				codepage = 65001;
			}else if ((opts.charset === 'UCS-2') || (opts.charset === 'UCS-2LE')){
				codepage = 1200;
			}else if (opts.charset === 'UCS-2BE'){
				codepage = 1201;
			}else if (opts.charset === 'GBK'){
				codepage = 936;
			}else if (opts.charset === 'GB18030'){
				codepage = 54936;
			}
		}else if (typeof(opts) === 'number'){
			codepage = opts;
		}

		if ((codepage === 936) || (codepage === 54936)){
			if (typeof(iconv) === 'undefined'){
				throw new Error('GBK or GB18030 need include iconv!');
			}
		}
		return codepage;
	}


	base16.length = function(b16str){
		return (b16str.length >> 1);
	}

	base16.mid = function(b16str, offset, count){
		if (typeof(count) === 'undefined'){
			count = (b16str.length >> 1) - offset;
		}
		return b16str.substr(offset<<1, count<<1);
	}

	base16.reverse=function(b16str, offset, count){
		var v = (typeof(offset) === "undefined")? b16str : base16.mid(b16str, offset, count);
		return v.match(/../g).reverse().join('');			
		// (new RegExp('(..){' + blockLen + '}', 'g'))
	}

	base16.toInt=function(b16str, offset, count){
		var v = (typeof(offset) === "undefined")? b16str : base16.mid(b16str, offset, count);
		return parseInt(v, 16);
	}

	base16.decode=function(b16str, opts){ // 基础型，增强型Alg.base16Decode
		//return b16str.replace(/../g, function(b16c){
		//	return String.fromCharCode(parseInt(b16c,16));
		//});
		var arr = [];
		var codepage = _get_codepage(opts);		

		for (var i=0; i<b16str.length; i+=2){
			var n = parseInt(b16str.substr(i,2),16);
			if (codepage === 65001){
				if (n >= 0x80) {
					var cnt = _get_utf8_size(n);
					n = _unicode_from_utf8_decode(n, cnt, b16str, i);
					i += ((cnt-1) * 2);
				}
			}else if ((codepage === 1200) || (codepage === 1201)){
				i += 2;
				var n2 = parseInt(b16str.substr(i,2),16);
				n = (codepage === 1200)? ((n2 << 8) | n) : ((n << 8) | n2);
			}
			arr.push(n);
		}

		if ((codepage === 936) || (codepage === 54936)){
			return iconv.decode(arr, (codepage === 936)? 'gbk' : 'gb18030');
		}
		
		if (opts && (opts.output === 'array')){
			return arr;
		}		
		return String.fromCharCode.apply(null, arr);
	}
	base16.encode=function(str, opts){ // 基础型，增强型Alg.base16Encode
		/*return str.replace(/.|\n/g, function(c){ // . 除了换行符之外的任意字符,等价于[^\n] 
			var n = c.charCodeAt(0);
			if (n < 0x80){
				return ((n < 16) && ('0' + n.toString(16).toUpperCase())) || n.toString(16).toUpperCase();
			}else{
				return _unicode_to_utf8_encode(n).toUpperCase();
			}
		}); //*/
		var codepage = _get_codepage(opts);		

		var numEncode = _num_encode_utf8;
		if (codepage == 1200){
			numEncode = _num_encode_utf16_le;
		}else if (codepage === 1201){
			numEncode = _num_encode_utf16_be;
		}else if ((codepage === 936) || (codepage === 54936)){
			str = iconv.encode(str, (codepage === 936)? 'gbk' : 'gb18030');
		}

		var arr = [];		
		if (str.constructor === String){
			for (var i=0; i<str.length; i++){
				arr.push(numEncode(str.charCodeAt(i)));
			}
		}else{
			for (var i=0; i<str.length; i++){
				arr.push(numEncode(str[i]));
			}
		}
		return arr.join("");
	}

	// 增强
	base16.left=function(b16str, count){
		return b16str.substr(0, count<<1);
	}
	base16.right=function(b16str, count){
		return b16str.slice(0-(count<<1));
	}

	base16.find=function(b16str, subString, startIndex){
		// var reg = new RegExp(subString + '(?=(?:..)*$)', '');
		// return (this.match(reg) && ((reg.lastIndex - subString.length) >> 1)) || -1;			
		for (var i=((startIndex||0) << 1); ;i++){
			i = b16str.indexOf(subString, i);
			if (i < 0) {
				return -1;
			}else if ((i & 1) === 0){
				return (i >> 1);
			}
		}
		return -1;
	}
	base16.indexOf=base16.find;
	
	base16.truncate=function(b16str, subString, startIndex){
		var pos = base16.indexOf(b16str, subString||'00', startIndex);
		return ((pos < 0) && b16str) || base16.left(b16str, pos);
	}

	base16.replace=function(b16str, str, dest){
		return b16str.replace(new RegExp(str + '(?=(?:..)*$)', 'g'), dest);
	}
	
	base16.xor=function(b16str, blockSize){
		blockSize = blockSize || (b16str.length >> 2)

		var r = new Array(blockSize);
		var a = b16str.match(/../g);
		for (var i=0; i<a.length; ){
			for (var j=0; j<blockSize; j++){
				var v = parseInt(a[i++],16);
				r[j] = (r[j] || 0) ^ v;
			}
		}
		for (var k=0; k<r.length; k++){
			var n = r[k];
			r[k] = (((n < 16) && '0' + n.toString(16)) || n.toString(16)).toUpperCase();
		}
		return r.join('');
		
		//es5
		//return b16str.match(new RegExp('(..){' + blockSize + '}', 'g')).map(function(s){
		//		return s.match(/../g).map(function(c){ return parseInt(c,16);})
		//	}).reduce(function(currentAr, nextAr){
		//		for (var i=0; i<currentAr.length; i++) {currentAr[i] ^= nextAr[i]};
		//		return currentAr;
		//	}).map(function(n){
		//		return (((n < 16) && '0' + n.toString(16)) || n.toString(16)).toUpperCase();
		//	}).join('');
	}
	
	base16.padLeft=function(b16str, full, blockSize){
		var blockSize_d = blockSize << 1;
		var appendLen = full.length;
		for (var i=0; (b16str.length%blockSize_d)&&(i<blockSize_d); i+=appendLen){
			b16str = full + b16str;
		}
		return b16str;
	}
	base16.padRight=function(b16str, full, blockSize){
		var blockSize_d = blockSize << 1;
		var appendLen = full.length;
		for (var i=0; (b16str.length%blockSize_d)&&(i<blockSize_d); i+=appendLen){
			b16str = b16str + full;
		}
		return b16str;
	}

	base16.fromInt=function(n, count){
		return ('000000000000000' + (n>>>0).toString(16).toUpperCase()).slice(0-((count||4)<<1));
	}

	// ------------------------------------------System String Core--------------------------------------------------
	if (!String.prototype.base16Length){
		// ljc
		String.prototype.base16Length=function(){
			return base16.length(this);
		}

		String.prototype.base16Mid=function(offset, count){
			return base16.mid(this, offset, count);
		}

		String.prototype.base16Reverse=function(offset, count){
			return base16.reverse(this, offset, count);
		}

		String.prototype.base16ToInt=function(offset, count){
			return base16.toInt(this, offset, count);
		}

		String.prototype.base16Decode=function(opts){
			return base16.decode(this, opts);
		}
		String.prototype.base16Encode=function(opts){
			return base16.encode(this, opts);
		}
		
		// 增强
		String.prototype.base16Left=function(count){
			return base16.left(this, count);
		}
		String.prototype.base16Right=function(count){
			return base16.right(this, count);
		}

		String.prototype.base16Find=function(subString, startIndex){
			return base16.find(this, subString, startIndex);
		}
		String.prototype.base16IndexOf=String.prototype.base16Find;

		String.prototype.base16Truncate=function(subString, startIndex){
			return base16.truncate(this, subString, startIndex);
		}

		String.prototype.base16Replace=function(str, dest){
			return base16.replace(this, str, dest);
		}
		
		String.prototype.base16Xor=function(blockSize){
			return base16.xor(this, blockSize);
		}

		
		String.prototype.base16PadLeft=function(full, blockSize){
			return base16.padLeft(this, full, blockSize);
		}
		String.prototype.base16PadRight=function(full, blockSize){
			return base16.padRight(this, full, blockSize);
		}

		// 兼容旧版本
		String.prototype.toInt=function(radix){
			return parseInt(this, radix||16);			
		}
	}

	// ------------------------------------------System Number Core--------------------------------------------------
	if (!Number.prototype.toHexString){
		// ljc
		Number.prototype.toHexString=function(count){
			return base16.fromInt(this, count);
		}
	}
	
	target.base16 = base16;
	return target;
}));
