define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang',"dojo/dom-class"],
	function(declare,_WidgetBase,_TemplateMixin,on,lang,domClass){

	var Tip = declare([_WidgetBase,_TemplateMixin],{

		templateString : '<div class="ui-pasd-tip">'+
							'<h4>${tipTitle}</h4>'+
							'<ul class="ui-pasd-rules">'+
								'<li class="ui-pasd-item" data-dojo-attach-point="lenRule">${lengthTxt}</li>'+
								'<li class="ui-pasd-item" data-dojo-attach-point="numberRule">${numberTxt}</li>'+
								'<li class="ui-pasd-item" data-dojo-attach-point="specialRule">${specialTxt}</li>'+
								'<li class="ui-pasd-item" data-dojo-attach-point="upperRule">${upperTxt}</li>'+
							'</ul>'+
							//'<p><span class="ui-pasd-level ui-pasd-level0" data-dojo-attach-point="levelImg"></span><span class="ui-pasd-text" data-dojo-attach-point="levelTle"></span></p>'+
							
							'<p class="ui-pasd-bar-wrap0" data-dojo-attach-point="barWrap">'+
								'<span class="ui-pasd-bar"></span>'+
								'<span class="ui-pasd-bar"></span>'+
								'<span class="ui-pasd-bar"></span>'+
								'<span class="ui-pasd-text" data-dojo-attach-point="levelTle"></span>'+
							'</p>'+
							
							'<span class="ui-pasd-rect" data-dojo-attach-point="rectEl"></span>'+
						'</div>',

		tipTitle : 'Password Requirement',

		lengthTxt : 'At least 8 characters',

		numberTxt : 'At least one number',

		specialTxt : 'At least one special character',

		upperTxt : 'At least one uppercase character',

		retTxt : ['','Weak','Medium','Strong'],

		curEl : null,

		level : null,

		visble : null,

		_setLevelAttr : function(level){
			this.levelTle.innerHTML = this.retTxt[level];
			//this.levelImg.className = 'ui-pasd-level ui-pasd-level'+level;
			this.barWrap.className = 'ui-pasd-bar-wrap'+level;
			this.levelTle.className = 'ui-pasd-text ui-pasd-text'+level;
		},

		postCreate : function(){

		},

		show : function(opts){
			var cur = opts.current,
				val = opts.value,
				x = opts.x,y = opts.y,
				rule = opts.rule;

			if(cur !== this.curEl || (cur === this.curEl && val !== this.val) ){
				this.domNode.style.left = x + 'px';
				this.domNode.style.top = y + 'px';
				this.changeSta(rule);
			}


			this.domNode.style.display = '';

			this.curEl = cur;
			this.val = val;
		},

		hide : function(){
			this.domNode.style.display = 'none';
		},

		makeVisble : function(obj){
			for(var i in obj){
				this[i+'Rule'].style.display = obj[i] ? '' : 'none';
			}
		},

		changeSta : function(rule){
			var level = rule.level,
				visble = rule.visble,
				rVisbel = rule.rVisble,
				i,dd;

			delete rule.level;
			delete rule.visble;
			delete rule.rVisble;

			this.set('level',level);

			this.makeVisble(rVisbel);
			this.makeVisble(visble);

			for(i in rule){
				dd = rule[i];
				domClass[dd ? 'add' : 'remove'](this[i+'Rule'],'ui-pasd-item-pass');
			}
		}

	}),tip = null;


	return {
		show : function(opts){
			if(!tip){
				tip = new Tip().placeAt(document.body,'last');
			}

			tip.show(opts);
		},

		hide : function(){
			tip.hide();
		},

		change : function(rule){
			tip.changeSta(rule);
		}
	};

});
