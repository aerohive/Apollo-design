define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','ah/util/message/Mask','dojo/on','dojo/_base/lang',"dojo/dom-construct"],
	function(declare, _WidgetBase, _TemplateMixin, Mask, on, lang,domConstruct){

	var ConfirmMsg = declare([_WidgetBase,_TemplateMixin],{

		templateString : '<div class="ui-cfmsg" data-dojo-attach-point="msgWrap">'+
							 '<div class="ui-tipbox-large ui-tipbox-plain ${msgClass}" data-dojo-attach-point="msgEl">'+
								'<i class="ui-tipbox-icon"></i>'+
								'<div class="ui-tipbox-con">'+
									'<h3 class="ui-tipbox-title" style="font-size:18px;color:#000;font-weight:500" data-dojo-attach-point="textEl">${msgText}</h3>'+
									'<p data-dojo-attach-point="desEl" class="mt10" style="display:none"></p>'+
									'<p style="margin:10px 0 0 0">'+
										'<button class="btn btn-small btn-dim" data-dojo-attach-point="yesBtn">${cfmTxt}</button>'+
										'<button class="btn btn-small btn-cancel" data-dojo-attach-point="noBtn">${cancelTxt}</button>'+
									'</p>'+
								'</div>'+
							 '</div>'+
							'</div>',
		cfmTxt : 'Yes',

		cancelTxt : 'No',

		fn : null,

		visible : null,

		msgClass : 'ui-tipbox-warning',

		/*_setMsgClassAttr : function(v){
			var name = 'ui-tipbox ui-tipbox-'+v;

			if(v){
				this.msgEl.className = name;
				this._set('msgClass',name);
			}
		},*/

		msgText : 'Are you sure you want to do this?',

		_setVisibleAttr : function(v){
			this.msgWrap.style.display = v;
			Mask[v == 'none' ? 'hide' : 'show']();
			this._set('visible',v);
		},

		_setMsgAttr : function(msg){
			var f = 'undefined' == typeof msg || msg == '' || msg == null;

			this.desEl.style.display = !f ? '' : 'none';
			!f && (this.desEl.innerHTML = msg);
		},

		buildRendering : function(){
			this.inherited(arguments);

			this._createLoading();
		},

		postCreate : function(){
			this.rendUI();
			this.bindUI();
		},

		rendUI : function(){
			document.body.appendChild(this.domNode);
		},

		bindUI : function(){
			this.own(
				on(this.noBtn,'click',lang.hitch(this,this.hide))
			);
		},

		handleCfm : function(fn,e){
			e.stopPropagation();

			var deferred = fn(),
				always = lang.hitch(this,function(){
					this.loadEl.style.display = 'none';
					this.hide();
				});

			if(deferred && deferred.then){
				this.loadEl.style.display = '';
				deferred.then(always,always);
			}else{
				this.hide();
			}
		},

		show : function(fn,title,msg){
			var title = 'undefined' == typeof title || title == null ? this.msgText : title;

			//if(!fn === this.fn){
				if(this._handler){
					this._handler.remove();
				}
				this._handler = on(this.yesBtn,'click',lang.hitch(this,this.handleCfm,fn));
			//}

			this._text(this.textEl,title);

			this.set('msg',msg);

			this.set('visible','');
		},

		hide : function(e){
			e && e.stopPropagation();

			this.set('visible','none');
		},

		_createLoading : function(){
			var div = document.createElement('div');

			div.className = 'grid-mark';

			div.style.display = 'none';

			this.loadEl = div;

			this.domNode.appendChild(div);
		},

		_text : function(el,v){
			var method = el.innerText ? 'innerText' : 'textContent';

			if('undefined' != typeof v){
				el[method] = v;
			}else{
				return el[method];
			}
		}

	}),msgInstance = null;


	return {
		show : function(fn,title,msg){
			if(!msgInstance){
				msgInstance = new ConfirmMsg();
			}
			msgInstance.show(fn,title,msg);
		}
	};

});
