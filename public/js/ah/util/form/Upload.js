define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin',
        'dojo/on','dojo/_base/lang','dojo/query',
         "dojo/dom-class","dojo/dom-style","dojo/dom-construct","ah/util/DataMgr"
        ],function(declare,_WidgetBase,_TemplateMixin,on,lang,query,domClass, domStyle, domConstruct, DataMgr){

        var getUniqueId = function(){
            var id = 0;
            return function(){
                return id++;
            }
        }();

        var UploadHandlerXhr = function(o){
            this._options = {
                // url of the server-side upload script,
                // should be on the same domain
                action: '/upload',
				//contentType : 'application/json',
                onProgress: function(id, fileName, loaded, total){},
                onComplete: function(id, fileName, response){}
            };
            lang.mixin(this._options, o);

            this._files = [];
            this._xhrs = [];
        };

        // static method
        UploadHandlerXhr.isSupported = function(){
            return typeof File != "undefined" &&
                typeof (new XMLHttpRequest()).upload != "undefined";
        };

        UploadHandlerXhr.prototype = {
            /**
             * Adds file to the queue
             * Returns id to use with upload, cancel
             **/
            add: function(file){
                return this._files.push(file) - 1;
            },
            /**
             * Sends the file identified by id and additional query params to the server
             * @param {Object} params name-value string pairs
             */
            upload: function(id, params){
                var file = this._files[id],
                    name = this.getName(id),
                    size = this.getSize(id);

                if (!file){
                    throw new Error('file with passed id was not added, or already uploaded or cancelled');
                }

                var xhr = this._xhrs[id] = new XMLHttpRequest(),
					fd = new FormData(),
					self = this;

				fd.append(this._options.name,file);

                xhr.upload.onprogress = function(e){
                    if (e.lengthComputable){
                        self._options.onProgress(id, name, e.loaded, e.total);
                    }
                };

                xhr.onreadystatechange = function(){
                    // the request was aborted/cancelled
                    if (!self._files[id]){
                        return;
                    }

                    if (xhr.readyState == 4){

                        self._options.onProgress(id, name, size, size);

                        var response;
                        try {
                            response = eval("(" + lang.trim(xhr.responseText) + ")");
                        } catch(err){
                            response = {};
                        }

                        self._options.onComplete(id, name, response);

                        self._files[id] = null;
                        self._xhrs[id] = null;
                    }
                };

                // build query string
                //var queryString = '?'+this._options.name+'=' + encodeURIComponent(name);
				var i = 0,queryString = '';
                for (var key in params){
                    queryString += (i == 0 ? '?' : '&') + key + '=' + encodeURIComponent(params[key]);
					i++;
                }

                xhr.open("POST", this._options.action + queryString, true);
				//xhr.setRequestHeader("Accept",this._options.contentType);
                xhr.setRequestHeader("X-CSRF-TOKEN", DataMgr.csrfToken);
                xhr.send(fd);
            },
            cancel: function(id){
                this._files[id] = null;

                if (this._xhrs[id]){
                    this._xhrs[id].abort();
                    this._xhrs[id] = null;
                }
            },
            getName: function(id){
                // fix missing name in Safari 4
                var file = this._files[id];
                return file.fileName != null ? file.fileName : file.name;
            },
            getSize: function(id){
                // fix missing size in Safari 4
                var file = this._files[id];
                return file.fileSize != null ? file.fileSize : file.size;
            },

			setAction : function(ac){
				this._options.action = ac;
			}
        };


        /**
         *@For low bowser, use iframe to upload
         */
        var UploadHandlerForm = function(){
            this._options = {
                // URL of the server-side upload script,
                // should be on the same domain to get response
                action: '/upload',
                // fires for each file, when iframe finishes loading
                onComplete: function(id, fileName, response){}
            };
            lang.mixin(this._options, o);

            this._inputs = {};
        };

        UploadHandlerForm.prototype = {
            add: function(fileInput){
                var input = fileInput,
                    id = 'ui-upload-handler-iframe' + getUniqueId();

                input.setAttribute('name','ahfile');
                this._inputs[id] = input;

                domConstruct.destroy(input);

                return id;
            },

            upload: function(id, params){
                var input = this._inputs[id];

                if (!input.length){
                    throw new Error('file with passed id was not added, or already uploaded or cancelled');
                }

                var fileName = this.getName(id);

                var iframe = this._createIframe(id);
                var form = this._createForm(iframe, params);
                form.appendChild(input);

                var self = this;
                this._attachLoadEvent(iframe, function(){
                    self._options.onComplete(id, fileName, self._getIframeContentJSON(iframe));

                    delete self._inputs[id];
                    // timeout added to fix busy state in FF3.6
                    setTimeout(function(){
                       domConstruct.destroy(iframe);
                    }, 1);
                });

                form.submit();
                domConstruct.destroy(form);

                return id;
            },
            cancel: function(id){
                if (id in this._inputs){
                    delete this._inputs[id];
                }

                var iframe = document.getElementById(id);
                if (iframe){
                    // to cancel request set src to something else
                    // we use src="javascript:false;" because it doesn't
                    // trigger ie6 prompt on https
                    iframe.setAttribute('src', 'javascript:false;');

                    domConstruct.destroy(iframe);
                }
            },
            getName: function(id){
                // get input value and remove path to normalize
                return this._inputs[id].value.replace(/.*(\/|\\)/, "");
            },
            _attachLoadEvent: function(iframe, callback){

                on(iframe,'load',function(){
                    if(!this.parentNode) return;

                    if (this.contentDocument &&
                        this.contentDocument.body &&
                        this.contentDocument.body.innerHTML == "false"){

                        return;
                    }

                    callback();
                });

            },
            /**
             * Returns json object received by iframe from server.
             */
            _getIframeContentJSON: function(iframe){
                // iframe.contentWindow.document - for IE<7
                var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
                    response;

                try{
                    response = eval("(" + doc.body.innerHTML + ")");
                } catch(err){
                    response = {};
                }

                return response;
            },
            /**
             * Creates iframe with unique name
             */
            _createIframe: function(id){
                // src="javascript:false;" removes ie6 prompt on https
               // var iframe = domConstruct.toDom('<iframe src="javascript:false;" name="' + id + '" />');
                var iframe = domConstruct.create('iframe');

                iframe.setAttribute('src',"javascript:false");
                iframe.name = id;
                iframe.setAttribute('id',id);

                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                return iframe;
            },
            /**
             * Creates form, that will be submitted to iframe
             */
            _createForm: function(iframe, params){
                // We can't use the following code in IE6
                // var form = document.createElement('form');
                // form.setAttribute('method', 'post');
                // form.setAttribute('enctype', 'multipart/form-data');
                // Because in this case file won't be attached to request
                var form = domConstruct.toDom('<form method="post" enctype="multipart/form-data"></form>');

				var i = 0,queryString = '';

                for (var key in params){
                    queryString += (i == 0 ? '?' : '&') + key + '=' + encodeURIComponent(params[key]);
					i++;
                }

                form.setAttribute('action', this._options.action + queryString);
                form.setAttribute('target', iframe.name);
                form.style.display = 'none';
                document.body.appendChild(form);

                return form;
            },

			setAction : function(ac){
				this._options.action = ac;
			}
        };



        /**
          *@Button Class for upload
          */
        var UploadButton = function(o){
            this._options = {
                element: null,
                // if set to true adds multiple attribute to file input
                multiple: false,
                // name attribute of file input
                name: 'file',
                onChange: function(input){},
                hoverClass: 'ui-upload-button-hover',
                focusClass: 'ui-upload-button-focus'
            };

            lang.mixin(this._options, o);

            this._element = this._options.element;

            // make button suitable container for input
            domStyle.set(this._element,{
                position: 'relative',
                overflow: 'hidden',
                // Make sure browse button is in the right side
                // in Internet Explorer
                direction: 'ltr'
            });


            this._input = this._createInput();
        };

        UploadButton.prototype = {
            /* returns file input element */
            getInput: function(){
                return this._input;
            },
            /* cleans/recreates the file input */
            reset: function(){
                this.destroy();
                this._input = this._createInput();
            },
            _createInput: function(){
                var input = domConstruct.create("input"),
                    self = this;

                if (this._options.multiple){
                    input.setAttribute('multiple','multiple');
                }

                input.setAttribute('type','file');
                input.setAttribute('name',this._options.name);

                domStyle.set(input,{
                    position: 'absolute',
                    // in Opera only 'browse' button
                    // is clickable and it is located at
                    // the right side of the input
                    right: 0,
                    top: 0,
                    zIndex: 1,
                    fontSize: '460px',
                    margin: 0,
                    padding: 0,
                    cursor: 'pointer',
                    opacity: 0
                });

                this._element.appendChild(input);

                this.ons(
                    on(input,'change',function(){
                        self._options.onChange(this);
                    }),
                    on(input,'mouseover',function(){
                         domClass.add(self._element,self._options.hoverClass);
                    }),
                    on(input,'mouseout',function(){
                         domClass.remove(self._element,self._options.hoverClass);
                    }),
                    on(input,'focus',function(){
                         domClass.add(self._element,self._options.focusClass);
                    }),
                    on(input,'blur',function(){
                        domClass.remove(self._element,self._options.focusClass);
                    })
                );

                // IE and Opera, unfortunately have 2 tab stops on file input
                // which is unacceptable in our case, disable keyboard access
                if (window.attachEvent){
                    // it is IE or Opera
                    input.setAttribute('tabIndex','-1');
                }

                return input;
            },

            ons : function(){
                var _self = this;
                this._events || (this._events = []);
                dojo.forEach(arguments,function(handle){
                    _self._events.push(handle);
                });
            },

            destroy : function(){
                domConstruct.destroy(this._input);
                dojo.forEach(this._events,function(handle){
                    handle.remove();
                });
                domClass.remove(this._element,this._options.focusClass);
                this._input = null;
            }
        };


        /**
          *@File item list
          */
        var Item = declare([_WidgetBase,_TemplateMixin],{

            templateString : '<li>' +
                        '<span class="ui-upload-file" data-dojo-attach-point="fileEl"></span>' +
                        '<span class="ui-upload-spinner" data-dojo-attach-point="spinEl"></span>' +
                        '<span class="ui-upload-size" data-dojo-attach-point="sizeEl"></span>' +
                        '<a class="ui-upload-del" href="#" data-dojo-attach-point="delEl">&#10005;</a>' +
                        '<a class="ui-upload-cancel" href="#" data-dojo-attach-point="cancelEl">${cancel}</a>' +
                        '<span class="ui-upload-failed-text" data-dojo-attach-point="failEl">${failText}</span>' +
                    '</li>',

            'cancel' : 'Cancel',

            'failText' : 'Failed',

            'successClass' : 'ui-upload-success',

            'failClass' : 'ui-upload-fail',

            postCreate : function(){
                this._bindUI();
            },

            _bindUI : function(){
                this.own(
                    on(this.delEl,'click',lang.hitch(this,this._handleDel)),
                    on(this.cancelEl,'click',lang.hitch(this,this._handleCancel))
                );
            },

            _handleDel : function(e){
                e.preventDefault();
                this.fileObj.onDelete();
                this.fileObj._filesUploaded--;
                this.destroy();
            },

            _handleCancel : function(e){
                e.preventDefault();
                this.fileObj._handler.cancel(this.xhrId);
                this.fileObj._filesUploaded--;
                this.destroy();
            },

            text : function(el,v){
                var method = this[el].innerText ? 'innerText' : 'textContent';
                if(typeof v == 'undefined'){
                    return this[el][method];
                }else{
                    this[el][method] = v;
                }

            },

            show : function(el){
                var self = this;
                if(lang.isArray(el)){
                    dojo.forEach(el,function(item){
                        self.show(item);
                    });
                    return;
                }
                this[el].style.display = '';
            },

            hide : function(el){
                var self = this;
                if(lang.isArray(el)){
                    dojo.forEach(el,function(item){
                        self.hide(item);
                    });
                    return;
                }
                this[el].style.display = 'none';
            },

            showResult : function(type){
                domClass.add(this.domNode,this[type+'Class']);
            },

            destroy : function(){
                this.fileObj.removeItemObj(this.xhrId);
                this.inherited(arguments);
            }

        });


        /**
          *@FileUpload core class
          */
        var FileUploader = declare('ah/util/form/Upload',[_WidgetBase,_TemplateMixin],{

            // before btn, btn-3 class would be ui-upload-button
            templateString : '<div class="ui-uploader">' +
                            '<div class="ui-upload-drop-area" data-dojo-attach-point="dropEl"><span>Drop files here to upload</span></div>' +
                            '<div class="btn btn-3" data-dojo-attach-point="btnEl">${btnText}</div>' +
                            '<ul class="ui-upload-list" data-dojo-attach-point="listEl"></ul>' +
                         '</div>',

            btnText : 'Upload a file',

            action: '/server/upload',
            // additional data to send, name-value pairs
            param: {},
            // ex. ['jpg', 'jpeg', 'png', 'gif'] or []
            allowedExtensions: [],
            // size limit in bytes, 0 - no limit
            // this option isn't supported in all browsers
            sizeLimit: 0,

            multiple : false,

            limit : 1,

			name : 'file',

            messages: {
                typeError: 'file type error',
                sizeError: 'The size of file should not exceed the maximum limitation ({sizeLimit})',
                emptyError: 'file empty error',
                countError : 'File account should not exceed {limit}.'
            },

            onSubmit: function(id, fileName){},

            onComplete: function(id, fileName, responseJSON){},

            onDelete : function(){},

            showMessage : function(message){
                alert(message);
            },


           // main programm

			_setActionAttr : function(ac){
				if(this._handler){
					this._handler.setAction(ac);
				}

				this._set('action', ac);
			},

            postCreate : function(){
                this._rendUI();
                //this._bindUI();
            },

            _rendUI : function(){
                var self = this;
                 // number of files being uploaded
                this._filesInProgress = 0;

                // number of files uploaded
                this._filesUploaded = 0;

                // store item
                this.itemHash = {};

                this._handler = this._createUploadHandler();

                this._button = new UploadButton({
                    element: this.btnEl,
                    multiple: this.multiple,//UploadHandlerXhr.isSupported(),
                    onChange: function(input){
                        self._onInputChange(input);
                    },
                    name : this.name
                });

                if(this.dnd){
                    this.dropEl.style.display = '';
                }
            },

            _bindUI : function(){
                this.own(

                );
            },

            setParam: function(param){
                this.param = param;
            },

            isUploading: function(){
                return !!this._filesInProgress;
            },

            _createUploadHandler : function(){
                var self = this,
                    handlerClass;

                if(UploadHandlerXhr.isSupported()){
                    handlerClass = UploadHandlerXhr;
                } else {
                    handlerClass = UploadHandlerForm;
                }

                var handler = new handlerClass({
                    name : this.name,
                    action: this.action,
                    onProgress: function(id, fileName, loaded, total){
                        // is only called for xhr upload
                        self._updateProgress(id, loaded, total);
                    },
                    onComplete: function(id, fileName, result){
                        self._filesInProgress--;

                        var item = self._getItemObj(id);

                        item.hide(['cancelEl','spinEl']);
                        item.show('delEl');

                        if (result.data){
                            item.showResult('success');
                        } else {
                            item.showResult('fail');

                            if (result.message){
                               self.showMessage(result.message);
                            }
                        }

                        self.onComplete(id, fileName, result);

                    }
                });

                return handler;
            },

            _updateProgress: function(id, loaded, total){
                var item = this._getItemObj(id),text;

                item.show('sizeEl');

                if (loaded != total){
                    text = Math.round(loaded / total * 100) + '% (' + this._formatSize(total) + ')';
                } else {
                    text = this._formatSize(total);
                }

               item.text('sizeEl',text);
            },

            _onInputChange : function(input){
                if (this._handler instanceof UploadHandlerXhr){

                    this._uploadFileList(input.files);

                } else {

                    if (this._validateFile(input)){
                        this._uploadFile(input);
                    }

                }

                this._button.reset();
            },

            _uploadFileList : function(files){
                var valid = true;

                var i = files.length;
                while (i--){
                    if (!this._validateFile(files[i])){
                        valid = false;
                        break;
                    }
                }

                if (valid){
                    var i = files.length;
                    while (i--){ this._uploadFile(files[i]); }
                }
            },

            _uploadFile : function(file){
                var id = this._handler.add(file),
                    name = this._handler.getName(id);

                // validate limit files
                if(++this._filesUploaded > this.limit){
                    this._error('countError',name);
                    return false;
                }
                this.onSubmit(id, name);
                this._addToList(id, name);
                this._handler.upload(id, this.param);
            },


            /**
              *@Helps
              */
            _validateFile : function(file){
                var name,size;

                if (file.value){
                    // it is a file input
                    // get input value and remove path to normalize
                    name = file.value.replace(/.*(\/|\\)/, "");
                } else {
                    // fix missing properties in Safari
                    name = file.fileName != null ? file.fileName : file.name;
                    size = file.fileSize != null ? file.fileSize : file.size;
                }

                if(this._filesUploaded >= this.limit){
                    this._error('countError',name);
                    return false;
                }

                if (! this._isAllowedExtension(name)){
                    this._error('typeError',name);
                    return false;

                } else if (size === 0){
                    this._error('emptyError',name);
                    return false;

                } else if (size && this.sizeLimit && size > this.sizeLimit){
                    this._error('sizeError',name);
                    return false;
                }

                return true;
            },

            _addToList : function(id, name){
                var item;

                this.itemHash['item'+id] = item = new Item({xhrId : id, fileObj : this});

                item.text('fileEl',this._formatFileName(name));
                item.hide(['sizeEl','delEl']);

                this.listEl.appendChild(item.domNode);
                this._filesInProgress++;
            },

            _formatFileName: function(name){
                if (name.length > 33){
                    name = name.slice(0, 19) + '...' + name.slice(-13);
                }
                return name;
            },

            _isAllowedExtension : function(fileName){
                var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
                var allowed = this.allowedExtensions;

                if (!allowed.length){return true;}

                for (var i=0; i<allowed.length; i++){
                    if (allowed[i].toLowerCase() == ext){
                        return true;
                    }
                }

                return false;
            },

            _error : function(type, fileName){
                var message = this.messages[type];

                // need put some detail message
                message = message.replace('{file}', this._formatFileName(fileName));
                message = message.replace('{extensions}', this.allowedExtensions.join(', '));
                message = message.replace('{sizeLimit}', this._formatSize(this.sizeLimit));
                message = message.replace('{limit}',this.limit);

                this.showMessage(message);
            },

            _formatSize: function(bytes){
                var i = -1;
                do {
                    bytes = bytes / 1024;
                    i++;
                } while (bytes > 99);

                return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
            },

            _getItemObj : function(id){
                return this.itemHash['item'+id];
            },

            removeItemObj : function(id){
                delete this.itemHash['item'+id];
            }

        });

        // finally got this Class
        return FileUploader;

});





