define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang',
		"dojo/dom-class","dojo/dom-construct"],
	function(declare,_WidgetBase,_TemplateMixin,on,lang, domClass, domConstruct){

		var defaults = {
			messages : {},
			rules : {},
			errorClass : 'error',
			validClass : 'valid',
			errorElement : 'span',
			focusInvalid : true,
			ignore : 'hidden',
			onkeyup : function(){},
			onclick : function(element,e){
				if ( this.getName(element) in this.submitted ) {
					this.checkElement(element);
				}else if( this.getName(element.parentNode) in this.submitted ){
					this.checkElement(element.parentNode);
				}
				// may be we lost select or option
				// but we always made select have one value
			},
			onfocus : function(){},
			onblur : function(element,e){
				if((this.submitted[this.getName(element)] || !this.optional(element)) && !this.checkable(element)){
					this.checkElement(element);
				}
			},
			onfocusout : function(element,e){
				if((this.submitted[this.getName(element)] || !this.optional(element)) && !this.checkable(element)){
					this.checkElement(element);
				}
			},
			highlight : function(element,errorClass,validClass){
				if(element.type == 'radio'){

				}else{
					domClass.add(element,errorClass);
					domClass.remove(element,validClass);
				}
			},
			unhighlight : function(element,errorClass,validClass){
				if(element.type == 'radio'){

				}else{
					domClass.add(element,validClass);
					domClass.remove(element,errorClass);
				}
			}
		},

		// format for message
		format = function(msg, params){
			if(arguments.length == 1){
				return function(){
					var args = [].slice.call(arguments);

					args.unshift(msg);

					return format.apply(this,args);
				};
			}

			if(arguments.length >= 2 && !lang.isArray(params)){
				if('function' === typeof params){
					params = params.call(this);
				}else{
					params = [].slice.call(arguments,1);
				}
			}

			if(!lang.isArray(params)){
				params = [params];
			}

			dojo.forEach(params, function(item, n){
				msg = msg.replace(new RegExp('\\{' + n + '\\}', 'g'), item);
			});

			return msg;
		},

		// validate methods
		methods = {

			required : function(val,element,param){
				if(!this.depend(param,element)){
					return 'dependency';
				}
				if(this.checkable(element)){
					return this.getLength(val,element) > 0;
				}

				if( element.nodeName.toLowerCase() == 'select' ){
					// didn`t support multiple select
					var v = element.value;

					return v && v.length > 0;
				}

				return lang.trim(val).length > 0;
			},

			textchar : function(val,element,param){
				return this.optional(element) || /^[A-Za-z\s]+$/g.test(val);
			},

			min: function( value, element, param ) {
				return this.optional(element) || value >= param;
			},

			max: function( value, element, param ) {
				return this.optional(element) || value <= param;
			},

			minlength : function(value, element, param){
				var length = lang.isArray( value ) ? value.length : this.getLength(lang.trim(value), element);
				return this.optional(element) || length >= param;
			},

			maxlength : function(value, element, param){
				var length = lang.isArray( value ) ? value.length : this.getLength(lang.trim(value), element);
				return this.optional(element) || length <= param;
			},

			range: function( value, element, param ) {
				var arr = 'function' === typeof param ? param.call(this.context) : param;

				return this.optional(element) || ( value >= arr[0] && value <= arr[1] );
			},

			number: function( value, element) {
				return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},

			equalTo : function( value, element, param){
				var arr = param.split('.'),
					el = this.context[arr[0]];

				if(arr.length > 1){
					el = el[arr[1]];
				}

				return value == el.value;

			},
			email: function(val, element, param){
				var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return this.optional(element) || reg.test(val);
			},

			length: function (value, element, length) {
				return this.optional(element) || (value.length === length);
			},

			speCharacter: function(val, element, length){
				return this.optional(element) || !(/\#|\$/.test(val));
			}
		},

		// error messages

		
		messages = {
			required : 'This field is required.',
			textchar : 'Should be A to Z and a to z.',
			maxlength: format("Please enter no more than {0} characters."),
			minlength: format("Please enter at least {0} characters."),
			range: format("Please enter a value from {0} to {1}."),
			max: format("Please enter a value less than or equal to {0}."),
			min: format("Please enter a value greater than or equal to {0}."),
			number : 'Please enter a valid number.',
			equalTo : 'The two fields should be equal.',
			email: 'The value must be an email address.',
			length: format('Please enter {0} characters exactly.')
		};
		


		/*
		validMsg = Msg.def,

		messages = {
			required : validMsg.required,
			textchar : validMsg.textchar,
			maxlength: format(validMsg.maxlength),
			minlength: format(validMsg.minlength),
			range: format(validMsg.range),
			max: format(validMsg.max),
			min: format(validMsg.min),
			number : validMsg.number,
			equalTo : validMsg.equalTo,
			email: validMsg.email,
			length: format(validMsg.length),
			speCharacter: validMsg.speCharacter
		};
		*/





		// exports object
		var o = {};


		o.setDefaults = function(opts){

		};


		o.addMethod = function(name,method,message){
			methods[name] = method;
			if(message){
				messages[name] = message;
			}
		};

		o.format = format;



		/**
		 *@Class validator
		 *@Params opts{Object} context {Object:this}
		 */
		o.validator = function(opts,context){
			this.settings = lang.clone(lang.mixin({},defaults,opts));
			this.context = context;

			this.init();
		};

		o.validator.prototype = {
			/*postCreate : function(opts,context){
				this.settings = lang.mixin(defaults,opts);
				this.context = context;

				this.init();
			},*/

			init : function(){
				this.elements = this.getElements();
				this.errorElsMap = {};
				this.submitted = {};

				var groups = (this.groups = {}),i,dd;
				for(i in this.settings.groups){
					dd = this.settings.groups[i];
					dojo.forEach(dd.split(/\s+/),function(el){
						groups[el] = i;
					});
				}
				//console.log(this.groups);

				this.reset();

				this.bindUI();
			},

			bindUI : function(){

				/*dojo.forEach(this.elements,lang.hitch(this,function(el){
					var method = this.checkable(el) ? 'click' : 'blur';

					this.own(
						on(el,method,lang.hitch(this,this.handler))
					);

				}));*/
				this.own(
					on(this.context.domNode,'input[type=text]:focusout, input[type=password]:focusout, textarea:focusout',lang.hitch(this,this.handler)),
					on(this.context.domNode,'input[type=checkbox]:click, select:click, option:click',lang.hitch(this,this.handler))
				);
			},

			handler : function(e){
				var t = e.target,
					type = e.type;

				//if(this.elements.indexOf(t) === -1) return;
				if(this.settings['on'+type]){
					this.settings['on'+type].call(this,t,e);
				}
			},

			form : function(){
				this.checkForm();

				this.showErrors();

				this.focusInvalid();

				return this.valid();
			},

			checkForm : function(){
				//this.prepareForm();
				this.reset();
				this.curType = 'form';

				this.currentEl = this.settings.ignore ? dojo.filter(this.elements,function(el){
					return el.offsetWidth != 0;
				}) : this.elements;

				for(var i = 0,dd,len = this.currentEl.length; i < len; i++){
					dd = this.currentEl[i];
					dd.domNode ? (dd.validate && dd.validate()) : this.check(dd);
				}

				return this.valid();
			},

			checkElement : function(element){
				var f;
				// this.prepareElement();
				this.reset();
				this.curType = 'element';
				this.currentEl = [element];
				f = this.check(element);
				this.showErrors();

				return f;
			},

			clearElement : function(element){
				var label = this.errorElsMap[this.getName(element)];

				if(this.settings.unhighlight){
					this.settings.unhighlight.call(this,element,this.settings.errorClass,this.settings.validClass);
				}

				if(label){
					this.hideEls([label]);
				}

			},

			valid : function(){
				return !this.errorList.length;
			},

			focusInvalid : function(){
				if(this.settings.focusInvalid){
					if(this.errorList.length){
						this.errorList[0].element.focus();
					}
				}
			},

			getElements : function(){
				var ret = [],dd,dl,dt,f,b;

				for(var i in this.settings.rules){
					dd = i.split('.');
					f = dd.length > 1;

					dl = this.context[dd[0]][dd[1]];
					dt = this.context[dd[0]];
					b = lang.isArray(dt);

					//f && dl.setAttribute('data-validId',i);
					if(f){
						dl.setAttribute('data-validId',i);
						dl.validator = this;
						ret.push(dl);
					}else{
						b ? (ret = ret.concat(dt)) : ret.push(dt);
					}
					//ret.push(f ? dl : dt);
				}
				//console.log(ret);
				return ret;
			},

			check : function(element){
				// if element is dojoWidgets
				var rules = this.getRules(element),
					val = this.elementVal(element),
					method,rule,result;

				for(method in rules){
					rule = {method : method, params : rules[method]};
					result = methods[method].call(this,val,element,rule.params);

					// Try to support something
					rule.result = result;

					if(!result || Array.isArray(result)){
						this.formatAndAdd(element,rule);
						return false;
					}
				}
				/*if(this.objectLen(rules)){
					this.successList.push(element);
				}*/

				return true;
			},

			formatAndAdd : function(element,rule){
				var message = this.defaultMessage(element,rule.method),
					reg = /\$?\{(\d+)\}/g,
					result = rule.result;

				if('function' === typeof message){
					message = message.call(this.context,rule.params);
				}else if(reg.test(message)){
					Array.isArray(result) &&
							(message = message.replace(reg, function(a, b){return result[b];}));
				}

				this.errorList.push({
					message : message,
					element : element
				});

				//this.errorMap[this.getName(element)] = message;
				this.submitted[this.getName(element)] = message;
			},

			customMessage : function(name,method){
				var m = this.settings.messages[name];

				return m && ('string' === typeof m ? m : m[method]);
			},

			defaultMessage : function(element,method){
				// should may be this.fineDefined(
				//		this.customMessage(),
				//		this.customDataMessage(),
				//		this.customMetaMessage()
				// )
				return this.customMessage(this.getName(element),method) ||
							messages[method];
			},

			elementVal : function(element){
				//leave type = radio or type = checkbox

				var val = element.value;

				if('string' === typeof val){
					return val.replace(/\r/g,'');
				}

				return val;
			},

			reset : function(){
				this.successList = [];
				this.errorList = [];
				//this.errorMap = {};

				this.toShow = [];
			},

			resetForm : function(){
				this.submitted = {};
				this.reset();
				this.curType = 'form';
				this.hideErrors();
				dojo.forEach(this.elements,lang.hitch(this,function(el){
					domClass.remove(el,this.settings.errorClass);
				}));
			},

			checkable: function(element) {
				return (/radio|checkbox/i).test(element.type);
			},

			getRules : function(element){
				var data,param;

				data = lang.clone(this.settings.rules[this.getName(element)]);

				if(data && data.required){
					param = data.required;
					delete data.required;
					data = lang.mixin({required : param},data);
				}
				//console.log(data,this.settings.rules);
				return data;
			},

			getName : function(element){
				var point = element.getAttribute('data-dojo-attach-point');

				return this.groups[point] || element.getAttribute('data-validId') || point;
			},

			getGroups : function(element){
				return this.groups[element.getAttribute('data-dojo-attach-point')];
			},

			normalizeRules : function(){
				var i,dd;

				for(i in this.settings.rules){
					dd = i.split('.');
					if(dd[1]){
						this.settings.rules[dd[1]] = this.settings.rules[i];
						delete this.settings.rules[i];
					}
				}

				return lang.clone(this.settings.rules);
			},

			showErrors : function(error){

				if(this.settings.showErrors){
					this.settings.showErrors(this.errorMap,this.errorList);
				}else{
					this.defaultShowErrors();
				}
			},

			defaultShowErrors : function(){
				var i,error,els;

				for(i = 0; this.errorList[i];i++){
					error = this.errorList[i];
					if(this.settings.highlight){
						this.settings.highlight.call(this,error.element,this.settings.errorClass,this.settings.validClass);
					}

					this.showLabel(error.element,error.message);
				}

				if(this.settings.success){

				}

				if(this.settings.unhighlight){
					for(i = 0, els = this.validElements(); els[i]; i++){
						this.settings.unhighlight.call(this,els[i],this.settings.errorClass,this.settings.validClass);
					}
				}

				// hide and show
				this.hideErrors();
				this.showEls(this.toShow);
			},

			showLabel : function(element,message){
				var label = this.errorElsMap[this.getName(element)];

				if(label){
					domClass.add(label,this.settings.errorClass);
					domClass.remove(label,this.settings.validClass);

					label.innerHTML = message;
				}else{
					label = domConstruct.create(this.settings.errorElement);
					label.className = this.settings.errorClass;
					label.innerHTML = message;

					if(this.settings.errorPlacement){
						this.settings.errorPlacement.call(this.context,label,element);
					}else{
						domConstruct.place(label,element,'after');
					}

					this.errorElsMap[this.getName(element)] = label;
				}

				this.toShow.push(label);
			},

			hideErrors : function(){
				if(!this.currentEl || !this.currentEl.length) return;

				var el = this.errorElsMap[this.getName(this.currentEl[0])],
					list = this.curType == 'element' ?
							(el ? [el] : []) :
								this.getLabels();

				this.hideEls(this._grep(list));
			},

			validElements : function(){
				var arr = [],_self = this;
				dojo.forEach(this.currentEl,function(el){
					if(_self.invalidElements().indexOf(el) === -1){
						arr.push(el);
					}
				});

				return arr;
			},

			invalidElements : function(){
				var arr = [];
				dojo.forEach(this.errorList,function(item){
					arr.push(item.element);
				});
				return arr;
			},

			optional : function(element){
				var val = this.elementVal(element);

				return !methods.required.call(this,val,element);
			},

			depend : function(param,element){
				return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param,element,this.context): true;
			},

			getLength : function(value, element){
				var str,els;

				switch( element.nodeName.toLowerCase() ) {
					case 'select':
						return ;
					case 'input':
						if( this.checkable( element) ) {
							els = (str = this.getGroups(element)) ? this.context[str] : [element];
							return this._filterChecked(els);
						}
				}

				return value.length;
			},

			dependTypes : {
				'boolean' : function(param){
					return param;
				},
				'function' : function(param,element,context){
					return param.call(context,element);
				}
			},

			own : function(){
				this._eventsList || (this._eventsList = []);
				dojo.forEach(arguments,lang.hitch(this,function(handle){
					this._eventsList.push(handle);
				}));
			},

			destroy : function(){
				dojo.forEach(this._eventList,function(handle){
					handle.remove();
				});
			},

			getLabels : function(){
				var arr = [],i;

				for(i in this.errorElsMap){
					arr.push(this.errorElsMap[i]);
				}

				return arr;
			},

			addRules : function(el,rules,messages){
				// add element to elements
				this.elements.push(el);

				this.settings.rules[this.getName(el)] = rules;

				if(messages){
					this.settings.messages[this.getName(el)] = messages;
				}
			},

			removeRules : function(){
				// need remove element from elements
			},

			_grep : function(list){
				var arr = [];

				dojo.forEach(list,lang.hitch(this,function(label){
					if(this.toShow.indexOf(label) === -1){
						arr.push(label);
					}
				}));

				return arr;
			},

			_filterChecked : function(els){
				var n = 0;

				dojo.forEach(els,function(el){
					el.checked && n++
				});

				return n;
			},

			hideEls : function(el){
				this._display(el,'none');
			},

			showEls : function(el){
				this._display(el);
			},

			_display : function(el,type){
				el.length &&
					dojo.forEach(el,function(item){
						item.style.display = type ? type : '';
					});
			}
		};

		/*o.validator = declare([_WidgetBase],{


		});*/


		return o;

});
