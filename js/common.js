var Debug;

(function(){
	
	// WebRequest
	if (window.parent && (window.parent !== window)){		
		Debug = { writeln: function(s) { window.parent.postMessage(s+"\n", "*"); } };
	}else {
		Debug = { writeln: console.log.bind(console) };
	}

	/*if (typeof(JSON) === "undefined") {
		document.writeln("<script src=\"jsp/json.min.js\"></script>");
	}	
	
	if (typeof(Promise) === "undefined") {
		document.writeln("<script src=\"jsp/es5.min.js\"></script>");
		document.writeln("<script src=\"jsp/es6.min.js\"></script>");
	}*/	
	
	
	function hexString2Array(str, arr) {
		arr = arr || (new Array(str.length >> 1));
		for (var i = 0, j=0, strLen = str.length; i < strLen; i+=2) {
			arr[j++] = parseInt(str.substr(i,2),16);
		}
		return arr;
	}
	function hexString2Uint8Array(str) {
		return hexString2Array(str, new Uint8Array(new ArrayBuffer(str.length >> 1)))
	}

	var loadScript_doc = function(doc, jspath, onReadyCallback){
		var src = doc.createElement("script");
		src.type = "text/javascript";
		src.setAttribute("src", jspath);
		if (onReadyCallback){
			if (src.readyState) { // IE 6，7，8
				src.onreadystatechange = function() {
					if (src.readyState === 'loaded' || src.readyState === 'complete') {
						src.onreadystatechange = null
						onReadyCallback()
					}
				}
			} else { // Not IE
				src.onload = onReadyCallback;
			}
		}  
		var head = doc.head || doc.getElementsByTagName('head')[0];
		head.appendChild(src);
	}
	
	window.hexString2Array = hexString2Array;
	window.hexString2Uint8Array = hexString2Uint8Array;

	window.loadScript =  function(jspaths, onReadyCallback){
		if (typeof(Uint8Array) === 'undefined'){
			var Mgr = window.external.GetAt("OBJ_MGR");
			Mgr.CreateInstance('shell.application').ShellExecute(window.location.href);
		}else{
			for (var i=0; i<jspaths.length; i++){
				loadScript_doc(document, jspaths[i], onReadyCallback);
			}
		}
	}

}());	

function $(id){
	return document.getElementById(id);
}

// 游览器提供的内置对象
if (typeof(console) === 'undefined'){
	window.console = {assert:function(ok){}};
}
