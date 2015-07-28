define([], function(){
	
	var tmpl = _ = function(str, data){
		var isEl = str.nodeName;

		var f = function(){

			var element = isEl ? str : document.getElementById(str);

			if(isEl || element){
				var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;

				return _.complie(html);
			}else{
				return _.complie(str);
			}

		}();

		return f(data);				
	};


	_.LEFT = '<%';
	_.RIGHT = '%>';


	_._encodeReg = function(str){
		return (''+str).replace(/([.*+?^=!:${}\(\)|\[\]\/\\])/g,'\\$1');
	};


	var left = _._encodeReg(_.LEFT),
		right = _._encodeReg(_.RIGHT);


	_.complie = function(str){
		var body = "var _tmplArr=[];\nwith(_tmplData){\n_tmplArr.push('"+_._parse(str)+"');\n}\nreturn _tmplArr.join('');\n";
		return new Function("_tmplData",body);
	};


	_._parse = function(str){
		str = (''+str).replace(/[\r\t\n]/g, '')
				.replace(new RegExp(left+"(?:(?!"+right+")[\\s\\S])*"+right+"|((?:(?!"+left+")[\\s\\S])+)","g"),function (item, $1) {
                	var str = '';

                	if($1){
                    	str = $1.replace(/\\/g,"&#92;").replace(/'/g,'&#39;');

                    	while(/<[^<]*?&#39;[^<]*?>/g.test(str)){
                        	str = str.replace(/(<[^<]*?)&#39;([^<]*?>)/g,'$1\r$2');
                    	};
                	}else{
                    	str = item;
                	}
                	return str ;
            	});

		str = str.split(left).join('\t');				

		str = str.replace(new RegExp("\\t=(.*?)"+right,"g"),"',typeof($1) === 'undefined'?'':$1,'");

		str = str.split('\t').join("');");

		str = str.split(right).join("_tmplArr.push('");

		str = str.split('\r').join("\\'");

		return str;
	};

	return _;

});
