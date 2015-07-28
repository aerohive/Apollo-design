define(['dojo/_base/declare',
		'dojo/on',
		'dojo/query',
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/string",
		"ah/util/DataMgr",
		"dojox/form/Uploader"],function(declare, on, query, domStyle, domConstruct, domAttr,lang, array, string, DataMgr, Uploader){
	
		return declare('ah/util/dojocover/Uploader',[Uploader],{

			extraParams : null,

			msg : function(msg){ alert(msg); },

			// ['jpg', 'jpeg', 'png', 'gif']
			allowExtension : [],

			// 0 - no limit
			sizeLimit: 0,

			messages : {
				allow : 'We not support ${fileType} type.',
				sizeLimit : 'File account should not exceed ${limit}'
			},

			getUrl : function(){
				var url = this.inherited(arguments), 
					extraParams = this.extraParams,
					i, str = '';

				for(i in extraParams){
					dd = extraParams[i];
					if(i == 'fileName' && !this.multiple){
						dd = this.getFileList()[0].name;
					}
					str += '&' + i + '=' + dd;
				}

				return url + '?' + str.slice(1);
			},
			
			createXhr : function(){
				var xhr = this.inherited(arguments);

				xhr.setRequestHeader("X-CSRF-TOKEN", DataMgr.csrfToken);

				return xhr;
			},

			_validate : function(fileList){
				var i = 0, f = true, 
					totalSize = 0, fileType, dd;

				for(;i < fileList.length; i++){
					dd = fileList[i];
					fileType = this.getFileType(dd.name);
					if(array.every(this.allowExtension, function(type, i){return !(type.toUpperCase() === fileType);})){
						this.msg(string.substitute(this.messages.allow, {fileType : fileType}));
						return false;
					}
					totalSize += dd.size;
				}

				if(this.sizeLimit > 0 && totalSize > this.sizeLimit){
					this.msg(string.substitute(this.messages.sizeLimit, {limit : this.sizeLimit}));
					return false;
				}
						
				return true;
			}

		});

	});
