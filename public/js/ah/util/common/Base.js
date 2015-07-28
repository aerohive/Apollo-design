define([
		'dojo/_base/declare','dojo/on','dojo/_base/lang',"dojo/query",
		"ah/util/DataMgr","dojo/topic", "dojo/fx",'dojo/_base/fx'
		],function(declare, on, lang, query, DataMgr, topic, fx, bFx){

		return declare(null,{

			/**
			 *@Ajax
			 *@Shortcut methods
			 */
			$DataMgr : DataMgr,

			$get : function(url,fn,error){
				var args = [].slice.call(arguments,2),
					fnArr = this._mkfnArr(args,fn);

				return DataMgr.get(this._mkOpts({
					url : url,
					callbackFn : fnArr[0]
				},fnArr[1]));
			},

			$post : function(url,data,fn,error){
				var args = [].slice.call(arguments,3),
					fnArr = this._mkfnArr(args,fn);

				return DataMgr.post(this._mkOpts({
					url : url,
					data : data,
					callbackFn : fnArr[0]
				},fnArr[1]));
			},

			$put : function(url,data,fn,error){
				var args = [].slice.call(arguments,3),
					fnArr = this._mkfnArr(args,fn);

				return DataMgr.put(this._mkOpts({
					url : url,
					data : data,
					callbackFn : fnArr[0]
				},fnArr[1]));
			},

			$del : function(url,fn,error){
				var args = [].slice.call(arguments,2),
					fnArr = this._mkfnArr(args,fn);

				return DataMgr.del(this._mkOpts({
					url : url,
					callbackFn : fnArr[0]
				},fnArr[1]));
			},

			/**
			 *@Button wait ajax
			 *@Autoly set button disabled and removedisabled autoly
			 *@d meaning disabled
			 */
			$dPost : function(t){

				return this.$extraXhr('post', [t, 'disabled']); // or {el : t, type 'disbaled'}
			},

			$dPut : function(t){

				return this.$extraXhr('put', [t, 'disabled']); // or {el : t, type 'disbaled'}
			},

			$dGet : function(t){
				return this.$extraXhr('get', [t, 'disabled']); // or {el : t, type 'disbaled'}
			},

			$tgGet : function(t){

				return this.$extraXhr('get', [t, 'toggle']); // or {el : t, type 'toggle'}
			},

			$tgPost : function(t){

				return this.$extraXhr('post', [t, 'toggle']); // or {el : t, type 'toggle'}
			},

			$extraXhr : function(method, cfg){
				var bData = method == 'put' || method == 'post',
					n = bData ? 3 : 2;

				return lang.hitch(this,function(url,data,fn,error){

					var args = [].slice.call( arguments, n ),
						fnArr, configs ;

					if('function' ==  typeof data){
						fn = data;
					}

					fnArr = this._mkfnArr( args, fn );

					configs = this._mkOpts(
								lang.mixin({url : url, callbackFn : fnArr[0], special : cfg}, bData ? {data : data} : {}),
								fnArr[1]
							);

					return DataMgr[method](configs);

				});

			},


			/**
			 *@Ajax Helps
			 */

			_mkOpts : function(opts,error){
				if(error) opts.errorFn = lang.hitch(this,error);

				return opts;
			},

			_mkfnArr : function(args,fn){
				var lastArg = args[args.length-1],that = this,
					errFn = 'function' == typeof lastArg ? args.pop() : null;

				return [
					function(){
						fn.apply(that,args.concat([].slice.call(arguments)));
					},
					errFn
				];
			},


			/**
			 *@Emit
			 */
			$emit : function( el, type, cfg ){
				if(el.tagName == 'INPUT' && el.type == 'checkbox' && 'boolean' == typeof cfg){
					el.checked = 'ActiveXObject' in window ? !cfg : cfg;
					cfg = {};
				}

				cfg = cfg || {};

				return on.emit(el,type,lang.mixin({
						bubbles: true,
    					cancelable: true
					},cfg));
			},


			/**
			 *@Publish
			 */
			// just for backword compact, would remove
			publish : function(){
				topic.publish.apply(this,arguments);
			},

			$publish : function(){
				topic.publish.apply(this,arguments);
			},


			$query : function(el,f){
				var list;

				if(f){
					list = 'boolean' === typeof f ? query(el) : query(el,f);
				}else{
					list = query(el,this.domNode);
				}

				return list;

			},


			/**
			 *@text
			 */
			$text : function(el,value){
				var text = el.innerText ? 'innerText' : 'textContent';

				if(typeof value !== 'undefined'){
					el[text] = value;
				}else{
					return el[text];
				}
			},


			$isHidden : function(el){
				return (el.offsetWidth == 0 && el.offsetHeight == 0) ||
						el.style.display == 'none';
			},

			$isVisible: function (el) {
				return !this.$isHidden(el);
			},

			$contains : function(p,c){
				if(p.compareDocumentPosition){
					return p.compareDocumentPosition(c) === 20;
				}else{
					return p.contains(c);
				}
			},


			/**
			 *@Animate
			 *@Shutcut methods
			 */
			$wipeIn : function(el,opts){
				return fx.wipeIn(lang.mixin({
						node : el
					},opts || {})).play();
			},

			$wipeOut : function(el,opts){
				return fx.wipeOut(lang.mixin({
						node : el
					},opts || {})).play();
			},

			$fadeIn : function(el,opts){
				return bFx.fadeIn(lang.mixin({
						node : el,
						onBegin : function(){
							el.style.display = '';
						}
					},opts || {})).play();
			},

			$fadeOut : function(el,opts){
				return bFx.fadeOut(lang.mixin({
						node : el,
						onEnd : function(el){
							el.style.display = 'none';
						}
					},opts || {})).play();
			},

			$toggleFade : function(el,f){
				return this.__toggleAnim('fade',el,f);
			},

			$toggleWipe : function(el,f){
				return this.__toggleAnim('wipe',el,f);
			},

			__toggleAnim : function(type,el,f){
					var methods = [type + 'In',type + 'Out'],
						flag,method;

					flag = 'undefined' === typeof f ? (el.style.display == 'none') : f;

					method = flag ? methods[0] : methods[1];

					return this['$'+method](el);
			},

			isEmptyObject : function(obj) {
				  
				  for (var prop in obj){
				    return false;
				  }
				  return true;		
			}

		});

});
