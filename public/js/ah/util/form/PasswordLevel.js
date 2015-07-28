define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang',
        "dojo/dom-geometry",
		'ah/util/message/PasswordTip'],
	function(declare,_WidgetBase,_TemplateMixin,on,lang,domGeom,Tip){
		
	return declare('ah/util/form/PasswordLevel',[_WidgetBase],{

		_rules : {
			'len' : function(val){return val.length >= 8;},
			'max': function(val){return val.length <= 32;},
			'number' : /\d/
		},

		optionRules : {
			'special' : /[!@#$%^&*\(\)~\-+=_\]\[\.;\\\/'`]/,
			'upper' : /[A-Z]/
		},

		rType : 'special',

		tip : Tip,
		mLen : false,
		bLen : true,
		bNumber : true,
		//bSpecial : true,

		postCreate : function(){
			this.rendRules();
			this.bindUI();

			this.domNode.removeAttribute('data-dojo-type');
		},

		bindUI : function(){
			this.own(
				on(this.domNode,'focus',lang.hitch(this,this._handleFocus)),
				on(this.domNode,'keyup',lang.hitch(this,this._handleKeyup)),
				on(this.domNode,'blur',lang.hitch(this,this._handleBlur))
			);
		},

		rendRules : function(){
			for(var i in this.optionRules){
				this.addRule(i,this.optionRules[i]);
			}

			this._needMap = {
				len : true,
				max : false,
				number : true
			};
			this._needMap[this.rType] = true;
		},
		
		_handleFocus : function(e){
			var t = e.target,
				v = lang.trim(t.value),
				p = domGeom.position(t,true);

			this.tip.show({
		 		x : p.x+p.w+20,
		 		y : p.y-100,
		 		current : t,
		 		rule : this._check(v),
			   	value : v	
			});
		},

		_handleKeyup : function(e){
			var t = e.target,
				v = lang.trim(t.value),opt;

			// we may need setTimeout for perfemmance
			opt = this._check(v);

			this.tip.change(opt);
		},

		_handleBlur : function(e){
			this.tip.hide();
		},

		addRule : function(name,rule){
			if(this._rules[name]) return;

			this._rules[name] = rule;
		},

		_check : function(v){
			var i,dd,dt,o = {};

			o.visble = {};
			o.rVisble = {};


			for(i in this._rules){
				// check rules
				dd = this._rules[i];
				dt = this.upperFirstChar(i);

				if(!this._needMap[i]) continue;

				if('function' === typeof dd){
					o[i] = dd(v);
				}else{
					o[i] = dd.test(v);
				}

				// for _rules and b*** to visble
				typeof this['b'+dt] != 'undefined' && (o.visble[i] = this['b'+dt]);
			}
			
			o.level = this._getSum(o);

			// for type cause to visble
			for(i in this.optionRules){
				o.rVisble[i] = (i == this.rType);
			}
			
			return o;
		},

		_getSum : function(obj){
			var i = 0,key;

			for(key in obj){
				if(key == 'visble' || key == 'rVisble') continue;
				obj.hasOwnProperty(key) && obj[key] && i++;
			}

			return i;

		},

		upperFirstChar : function(str){
			var str = str.toLowerCase();

			return str.charAt(0).toUpperCase() + str.substring(1);
		}

	});
});
