define( [ "dojo/_base/declare",
            "dojo/request",
            "dojo/_base/lang",
            "dojo/Deferred",
            "dojo/promise/all",
			"ah/util/message/PopMsg", "ah/util/message/StatusMsg", "dojo/aspect", "dojo/request/notify",
			"ah/config/callbacks","ah/util/dojocover/__AHDialogCache"
		],
    function ( declare, request, lang, Deferred, promiseAll, PopMsg, StatusMsg, aspect, notify, callbacks, dialogCache) {

        /**
         *@Summry
         * We do not want to use this by new DataMgr(), we should not make a new object when we need a ajaxRequest Api every time.
         * Now, our code has a lot of (new DataMgr()) these code.
         * I think we just need {} api for this.
         *@Rebuild
         * use this api, we just need use like DataMgr.post,DataMgr.get,DataMgr.put,DataMgr.del;
         * cause, before we got these code (new DataMgr), so I would make some thing to make backward compatible.
         */


        /**
         *@Object xhrApi for the singel object
         */
        var xhrApi = {
            makePostRequest: function (params) {

                return this.request('post', params);
            },

            makePutRequest: function (params) {

                return this.request('put', params);
            },

            makeDelRequest: function (params) {

                return this.request('del', params);
            },

            makeGetRequest: function (params) {

                return this.request('get', params);
            },

            makeJSONPRequest: function (params) {

            },

            /**
             *@Helps
             *@For common
             */
            request: function (type, params) {

                var data = params.data,//dojo.toJson(params.data || {}),
                    type = type.toLowerCase(),
                    header = {
                        "Content-Type": "application/json",
                        "Accept": params.acceptHeader ? params.acceptHeader : "application/json"
                    },
                    header = {
                        headers: header,
                        handleAs: "json"
                    },
                    header = lang.mixin(header, params.header || {}),
                    opts = {
                        post: {
                            data: data
                        },
                        get: {
                        },
                        put: {
                            data: data
                        },
                        del: {
                        }
                    },
                    cfgs = lang.mixin({}, opts[type], header),
                    method, url;

                if (!opts[type]) return false;

                // something happened typeof params.data
                delete params.data;
                cfgs = lang.mixin(cfgs, params);


                if (cfgs.requestURL) {
                    cfgs.url = cfgs.requestURL;
                }

                if (!DataMgr.noId && !cfgs.noId) {
                    cfgs.url = url = this.norUrl(cfgs.url);
                }

				if('ActiveXObject' in window){
					//cfgs.preventCache = true;
					cfgs.headers['If-Modified-Since'] = '0';
				}

				if ((type != "get")) {
					cfgs.headers['X-CSRF-TOKEN'] = DataMgr.csrfToken;
				}

                return this._xhr(type, cfgs);

            },

            _request: function (type, opts, params) {
                var promiser = request[type](params.requestURL, opts),
                    callbackFn = params.callbackFn,
                    errorFn = params.errorFn,
                    scope = params.parent,
                    that = this;

                return promiser.response.then(function (response) {
                    that.toFn(callbackFn, scope)(response.data);
                    if (response.data.redirect) location.href = response.data.redirect;
                }, function (response) {
                    //if(!that._gError(response.status)) return;
                    var d = response.response;
                    that._gError(d.url, d.status, d.data);
                    that.toFn(errorFn, scope)(response.data, response);
                });
            },

            _xhr: function (type, opts) {
                var typeMap = {
                        get: 'Get',
                        del: 'Delete',
                        post: 'Post',
                        put: 'Put'
                    },
                    callbackFn = opts.callbackFn,
                    errorFn = opts.errorFn,
                    scope = opts.parent;

                if ((type == 'post' || type == 'put') && opts.data) {
                    opts.postData = this._attachOwnerId(opts.data, opts.url, opts.ignoreOwnerId);
                }

				/*
                if (type == 'put') {
                    opts.postData = opts.data;
                }
				*/

                if (opts.postData) {
                    opts.postData = dojo.toJson(opts.postData);
                }


                return dojo['xhr' + typeMap[type]](lang.mixin({}, {
                    //url : params.requestURL,
                    load: this.toFn(callbackFn, scope),
                    error: lang.hitch(this, function (data, response) {
                        var d = data.response;
                        if (!errorFn || !this.toFn(errorFn, scope)(data, response)) {
                            this._gError(d.url, d.status, (d.data ? JSON.parse(d.data): d.data));
                        }
                    })
                }, opts));

                // data, response    response.xhr.status
            },

            // may need remove replace with notify
            _gError: function (url, status, data) {
                var i, len, dialog,
					showMsg = lang.hitch(StatusMsg,StatusMsg.show),
					popMsg = lang.hitch(PopMsg, PopMsg.show),
					error = data.error;

				if( len = dialogCache.length ){
					dialog = dialogCache[len - 1];
					dialog.isFocusable() &&
						(showMsg = popMsg = lang.hitch(dialog, dialog.showMsg));
				}

                if (/appinfo/.test(url)) return;

                switch (status) {
                    case 500:
                        showMsg('error', error.message);
                        break;
                    case 400:
                        if (error.validationErrors) {
                            for (i in error.validationErrors) {
                                showMsg('error', error.validationErrors[i][0]);
                                break;
                            }
                        } else {
                            showMsg('error', error.message);
                        }

                        // For suspended VHMs, we want to log the user out after a few seconds.
                        if (error.code == "access.denied.suspended.vhm") {
                            setTimeout(function(){ location.href = "oauth/logout"; }, 3000);
                        }

                        break;
                    case 401:
                        location.href = data.Location;
                        break;
                    case 403:
                        showMsg('error', '********');
                        break;
                    default:
                        break;
                }
            },

            _attachOwnerId: function (data, url, ignore) {
                var hasConfig = /\/config\/?/.test(url),
                    isLbs = /\/config\/lbs\/?/.test(url),
                    ownerId = data.ownerId,
                    //predefined = data.predefined,
                    loop = lang.hitch(this, function (d) {
                        var i, dd, dt, predefined = d.predefined;

						if(!d.predefined){
                       		d.ownerId = this.ownerId;
						}

                        for (i in d) {
                            dd = d[i];

                            if (dd && this.isObj(dd)) {
                                loop(dd);
                            }

                            if (dd && lang.isArray(dd)) {
                                dojo.forEach(dd, lang.hitch(this, function (item) {
                                    if (this.isObj(item)) {
                                        loop(item);
                                    }
                                }));
                            }
                        }

                    });

                // I may thought we can remove predefined and ownerId here
                if (isLbs || !hasConfig /*|| (ownerId && predefined)*/ || ignore) {
                    return data;
                }

                loop(data);

                //console.log(data);
                return data;
            },

            isObj: function (obj) {
                return obj.toString() === "[object Object]";
            },

            /**
             *@toFn
             *@return {function}
             */
            toFn: function (callback, scope) {

                return typeof callback == 'function' ? callback :
                    function (data) {
                        scope[callback].apply(scope, arguments);
                    }
            },

            norUrl: function (url) {
                var a = /(ownerIds?=)(\d+)/g, b = /\?/, d = /\/filter\/?/,
                    ownerId = this.ownerId,
                    hasOwner = a.test(url),
                    hasFilter = d.test(url),
                    dd = 'ownerId=' + ownerId,
                    dt = '&ownerIds=' + ownerId,
                    c, arr, params;

                if (hasOwner) {
                    url = url.replace(a, function (s, w, d) {
                        return w + ownerId;
                    });

                    return url;
                }

                c = b.test(url) ? '&' : '?';

                params = hasFilter ? dd : dd + dt;

                return url + c + params;

            },

            deferredAuditLog: function(promises, logData) {
                var that = this;
                if (promises) {
                    var deferred = new Deferred();
                    promiseAll(promises).then(
                        function(results) {
                            that.auditLog(logData);
                            deferred.resolve();
                    });
                } else {
                    this.auditLog(logData);
                }
            },

            auditLog:function(logData){
                this.post({
                    data: logData,
                    url: "services/admin/audit",
                    callbackFn: function () {},
                    errorFn: function (data) {
                        var message = JSON.parse(data.responseText).error.message;
                        console.log("Audit logging failed: " + message + " | logData = " + JSON.stringify(logData));
                        //_self.msgErr('<div>Subscription log' + message + '</div>', dojo.query('.free-ap-registration')[0], 'first');
                    }
                });
            }

        };

        xhrApi.post = xhrApi.makePostRequest;
        xhrApi.get = xhrApi.makeGetRequest;
        xhrApi.put = xhrApi.makePutRequest;
        xhrApi.del = xhrApi.makeDelRequest;


        /**
         *@Global ajax event
         *@
         */

        notify("send", function (obj) {
			gFn(obj, 'send');
        });

        notify("done", function (obj) {
			var obj = obj instanceof Error ? obj.response : obj;
			gFn(obj, 'done');
        });

        /*notify('error',function(error){
         var response = error.response,
         url = response.url,
         errorData = JSON.parse(response.data);

         if(/appinfo/.test(url)) return;

         switch(response.status){
         case 500:
         console.log(500);
         break;
         case 401:
         location.href = errorData.Location;
         break;
         case 403:
         PopMsg.show('error','You have no jurisdiction to do this.');
         break;
         default:
         break;
         }
         });*/


		/**
		 *@Helps
		 */
		function gFn(obj,name){
			var io, cfg, special, t, type;

			//console.log(obj.options.ioArgs.args);
			if( (io = obj.options) && (cfg = io.ioArgs) && (special = cfg.args.special) ){

				if(lang.isArray(special)){
					t = special[0];
					type = special[1];
				}else{
					t = special.el;
					type = special.type;
				}

				callbacks.xhr[name][type](t);
			}
		}


        /**
         *@Just for our backword compitable
         *@new DataMgr();
         */
        var DataMgr = function () {
            return xhrApi;
        };

        lang.mixin(DataMgr, xhrApi);


        return DataMgr;

    });
