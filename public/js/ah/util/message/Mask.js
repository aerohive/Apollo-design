define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang'],
	function(declare,_WidgetBase,_TemplateMixin,on,lang){
		
		var Mask = declare([_WidgetBase,_TemplateMixin],{

			templateString : '<div class="ui-msg-mark ui-msg-mark-white"></div>',

			postCreate : function(){
				this.bindUI();
			},

			bindUI : function(){
				this.domNode.style.height = document.body.clientHeight + 'px';

				document.body.appendChild(this.domNode);	
			},

			show : function(){
				this.domNode.style.display = '';
			},

			hide : function(){
				this.domNode.style.display = 'none';
			}

		}),
		maskInstance = null;

		return {
			show : function(){
				if(!maskInstance){
					maskInstance = new Mask();
				}
				maskInstance.show();
			},
			hide : function(){
				maskInstance && maskInstance.hide();
			}
		};

});
