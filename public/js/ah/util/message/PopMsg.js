define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang','dojo/fx'],
	function(declare,_WidgetBase,_TemplateMixin,on,lang,fx){
	
		var Msg = declare([_WidgetBase,_TemplateMixin],{
					
			templateString : '<div class="ui-popmsg" data-dojo-attach-point="msgWrap">'+
							 '<div class="ui-tipbox ${msgClass}" data-dojo-attach-point="msgEl">'+
								'<i class="ui-tipbox-icon"></i>'+
								//'<i class="ui-tipbox-close" data-dojo-attach-point="xEl"></i>'+
								'<div class="ui-tipbox-con"><h3 class="ui-tipbox-title" data-dojo-attach-point="textEl">${msgText}</h3></div>'+
							 '</div>'+
							'</div>',

			delay : 3e3,

			msgClass : 'ui-tipbox-success',

			_setMsgClassAttr : function(v){
				var name = 'ui-tipbox ui-tipbox-'+v;
					
				if(v){
					this.msgEl.className = name;
					this._set('msgClass',name);
				}
			},

			msgText : 'Message notice',

			_setMsgTextAttr : function(txt){
				if(txt){
					this.textEl.innerHTML = txt;
					this._set('msgText',txt);
				}
			},

			postCreate : function(){
				this.rendUI();
				this.bindUI();
			},

			/*startup : function(){
			},*/

			rendUI : function(){
				var wbody = document.body.clientWidth,
					hbody = document.body.clientHeight;

				this.msgWrap.style.left = wbody/2 + 'px';
				this.msgWrap.style.top = hbody/2 + 'px'
			},

			bindUI : function(){
			
			},

			show : function(type,message,delay){
				if(this.timer){
					this.timer.remove();
				}

				if(delay){
					this.set('delay',delay);
				}

				this.set('msgClass',type);
				this.set('msgText',message);
				this.msgWrap.style.display = '';

				this.timer = this.defer(this.hide,this.delay);
			},

			hide : function(){
				this.msgWrap.style.display = 'none';
			}
			
		}),instance = null;

		return {
			show : function(type,message,delay){
				if(!instance){
					instance = new Msg().placeAt(document.body,'last');
				}
				instance.show(type,message,delay);
			}
		};
});
