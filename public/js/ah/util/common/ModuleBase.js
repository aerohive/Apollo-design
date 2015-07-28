define([
		'dojo/_base/declare',
		"dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojo/on",
		"dojo/_base/lang",
		"ah/util/message/StatusMsg",
		"ah/util/message/ConfirmMsg",
		"ah/util/common/Base",
		"dojo/aspect",
		"dojo/_base/array",
		"dojo/query",
		"dojo/dom-style",
		"ah/util/dojocover/AHDialog",
		"ah/util/dojocover/__AHDialogCache"
		],function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, on, 
					lang, StatusMsg, CfmMsg, Base, _AhMixin, aspect, array, query, domStyle, Dialog, dialogCache ){
	
		return declare('ah/util/common/ModuleBase',[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Base],{

			//host : GDATA.ctx,

			postCreate : function(){
				this.inherited(arguments);

				this._bindEls();

				this.addEvents();
			},

			_bindEls : function(){
				var points = this._attachPoints,
					obj = {},i,dd,dl,arr,that = this;

				if(!points || !points.length) return;

				dojo.forEach(points,function(str){
					var tag = str.split('-'),type = tag[0]+'Els';
					if(tag.length > 1){
						(obj[type] || (obj[type] = [])).push(str);
					}
				});
			
				for(i in obj){
					dd = obj[i];
					this[i] = dojo.map(dd,function(item){
						return that[item];
					});
				}

				// for query case
				for(i in obj){
					dl = query(this[i][0]);
					dojo.forEach(this[i].slice(1),function(el){
						dl.push(el);
					});
					this[i.slice(0,-3)+'Qys'] = dl;
				}
			},

			/**
			 *@Like Backbone and spine bind events autoly
			 *@Example
			 * events : [
			 *	[string / element, 'click', 'handleClick' / function],
			 *	[string / element, 'click, dblclick', 'handleClick'],
			 *	[string / element, 'dblclick, button.myClass:click', 'handleClick'],
			 *	[string / element, 'tr:click', 'handleClick'],
			 *	[string / element, mouse.enter, 'handleClick'],
			 *	['elQys', 'click', 'handleClick'],
			 * ]
			 *
			 * string for parse time, element for run time
			 */
			addEvents : function(){
				if(!this.events || !lang.isArray(this.events)) return;

				// deal with AHWidget conflict
				// but we should just leave one widget for project
				//if('function' == typeof this.addEvents) return;

				array.forEach(this.events,lang.hitch(this,function(item,i){

					var elCp = item[0], fnCp = item[2], type = item[1], args = item.slice(3), f = /this\./,
						fn = 'string' == typeof fnCp ? this[fnCp] : 'function' == typeof fnCp ? fnCp : function(){return fnCp},
						el, handler, callback, mapArgs;

					'string' == typeof elCp ? 
								(el = this,elCp !== 'this' && dojo.forEach(elCp.split(/\b\.\b/),function(str){
									if(/\$query/.test(str)){
										el = el.$query(str.match(/\(['"](.+)['"]\)/)[1]);
									}else{
										el = el[str];
									}
								})) : (el = elCp); 
					

					// for dynamic arguments attach to widget itself
					mapArgs = array.map(args,lang.hitch(this,function(item){
						if('string' == typeof item && f.test(item)){
							return new Function('return ' + item).call(this);
						}else{
							return item;
						}	
					}));


					callback = lang.hitch(this,function(){
						fn.apply(this,mapArgs.concat([].slice.call(arguments)));
					});

					/*if(el.domNode){
						handler = el.bind ? el.bind(type, callback) : on(el, type, callback);

					}else{*/

						handler = !el.on ? on(el,type,callback) : el.on(type,callback);
					//}

					
					this.own(handler);

				}));
			}

			
			/*
			staMsg : function(type, message, h, p){
				var showMsg = lang.hitch(StatusMsg,StatusMsg.show),
					len;

				if( len = dialogCache.length ){
					dialog = dialogCache[len - 1];
					dialog.isFocusable() && 
						(showMsg = lang.hitch(dialog, dialog.showMsg));
				}

				showMsg(type, message, h, p);
			},

			msgSucc : function(message,h,p){
				this.staMsg('success',message,h,p);
			},

			msgErr : function(message,h,p){
				this.staMsg('error',message,h,p);
			},

			msgWarn : function(message,h,p){
				this.staMsg('warning',message,h,p);
			},

            
            msgHide: function () {
                StatusMsg.hide();
            },


			
			popMsg : function(type,message){
				PopMsg.show(type,message);
			},
			popMsgErr : function(message){
				PopMsg.show('error',message);
			},

			cfmMsg : function(fn,title,msg){
				CfmMsg.show(fn,title,msg);
			},


			$pop : function(cfg, widget, callback){
				var dialog = new Dialog(cfg);

				widget.dialog = dialog;

				dialog.set('content', widget.domNode);
				dialog.show();

				if(callback){
					callback(dialog, widget);
				}

				aspect.after(dialog, 'destroy', function(){widget.destroy && widget.destroy();});

				return dialog;
			}
			*/
			
		});

});
