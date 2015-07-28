/**
 *@We just support more than IE8
 *@So we can just change input type directly
 *@Why change type replace display, cause it would make validate simple
 */

define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang', "dojo/dom-construct", "dojo/dom-attr", 'ah/util/form/PasswordLevel'],
	function(declare,_WidgetBase,_TemplateMixin,on,lang, domCon, domAttr, PasswordLevel){

		return declare('ah/util/form/ObscureInput',[_WidgetBase,_TemplateMixin],{

			templateString : '<div class="${class}">'+
								'<div class="clearfix">'+
									'<div class="${labelClass} first column"><label data-dojo-attach-point="norLabel">${label}</label></div>'+
									'<div class="${inputClass} last column">'+
										'<input type="password" value="${value}" class="${textClass}" data-dojo-attach-point="norEl"/>'+
										//'<input type="text" value="${value}" class="${textClass}" data-dojo-attach-point="norElCp" />'+
									'</div>'+
								'</div>'+
								'<div class="line clearfix">'+
									'<div class="${labelClass} first column"><label data-dojo-attach-point="cfmLabel">${labelConfirm}</label></div>'+
									'<div class="${inputClass} last column">'+
										'<input type="password" value="${value}" class="${textClass}" data-dojo-attach-point="cfmEl"/>'+
										//'<input type="text" value="${value}" class="${textClass}" data-dojo-attach-point="cfmElCp" />'+
										'<button class="btn btn-3 ml5" data-dojo-attach-point="genBtn">Generate</button>'+
										'<label><input type="checkbox" data-dojo-attach-point="obscurEl" /><span class="lbl">${obscureTxt}</span></label>'+
									'</div>'+
								'</div>'+
							'</div>',
			
			'isGenegate' : false,
			
			'class' : '',
			
			'value' : '',

			'checked' : true,

			'passwordLevel' : false,

			'required' : false,

			'labelClass' : 'grid_4',

			'inputClass' : 'grid_12',

			'label' : 'Shared Secret',

			'labelConfirm' : 'Confirm Secret',

			'textClass' : '',

			'obscureTxt' : 'Obscure secret',

			'randomChar' : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%&'()*+,-./:;<=>@[]^_`{|}~",

			'randCharMap' : {
				'bLen' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
				'bNumber' : '1234567890',
				'bSpecial' : "!#$%&'()*+,-./:;<=>@[]^_`{|}~"
			},

			'count' : 64,

			//'des' : 'span|64 hex digits',

			// for PasswordLevel config
			bLen : true,
			bNumber : true,
			bSpecial : true,

			_setValueAttr : function(v){
				if(!v) v = '';
				//this.norEl.value = this.norElCp.value = this.cfmEl.value = this.cfmElCp.value = v;
				this.norEl.value = this.cfmEl.value = v;
				this._set('value',v);
			},

			_getValueAttr : function(){
				var v = lang.trim(this.norEl.value);
				
				return !v ? null : v;
			},

			_setCheckedAttr : function(f){
				this.obscurEl.checked = f;
				//this._toggleInput(f);
				this._toggleType(f);
				this._set('checked',f);
			},

			_setRequiredAttr : function(f){
				var className = f ? 'label-rqe' : '';

				this.norLabel.className = this.cfmLabel.className = className;
			},

			_setMaxLengthAttr : function(len){
				domAttr.set(this.norEl,"maxlength",len);
				domAttr.set(this.cfmEl,"maxlength",len);
			},

			postCreate : function(){
				this.rendUI();
				this.bindUI();
			},

			rendUI : function(){
				this.genBtn.style.display = this.isGenegate ? '' : 'none';

				this.makeDescription();

				if(this.passwordLevel){
					var level = new PasswordLevel({
						bLen : this.bLen,
						bNumber : this.bNumber,
						bSpecial : this.bSpecial
					},this.norEl);
				}

				this.passwordRange = this._makeChars();
			},
			
			bindUI : function(){
				this.own(
					//on(this.norEl,'keyup',lang.hitch(this,this._handleKeyup,'norElCp')),
					//on(this.norElCp,'keyup',lang.hitch(this,this._handleKeyup,'norEl')),
					//on(this.cfmEl,'keyup',lang.hitch(this,this._handleKeyup,'cfmElCp')),
					//on(this.cfmElCp,'keyup',lang.hitch(this,this._handleKeyup,'cfmEl')),
					on(this.obscurEl,'change',lang.hitch(this,this._handleChange)),
					on(this.genBtn,'click',lang.hitch(this,this._genegate))
				);
			},

			_handleKeyup : function(el,e){
				this[el].value = e.target.value;
			},

			_handleChange : function(e){
				//this._toggleInput(e.target.checked);
				this._toggleType(e.target.checked);
			},

			_toggleInput : function(f){
				this.norEl.style.display = this.cfmEl.style.display = f ? '' : 'none';
				this.norElCp.style.display = this.cfmElCp.style.display = !f ? '' : 'none';
			},

			_toggleType : function(f){
				this.norEl.type = this.cfmEl.type = f ? 'password' : 'text';
			},

			makeDescription : function(){
				if(!this.des){ return ;}

				var arr = this.des.split('|'),
					el = arr[0], des = arr[1];

				this.desEl = domCon.create(el,{innerHTML : des, 'className' : 'hint'});

				if(this.placeMent){
					this.placeMent(el,this.norEl);
				}else{
					domCon.place(this.desEl,this.norEl,'after');
				}
				
			},

			changeDes : function(msg){
				this.desEl.innerHTML = msg; 
			},

			_genegate : function(){
				var len = this.passwordRange.length,
					count = 'function' == typeof this.count ? this.count() : this.count,
					i,j,str = '';

				for(i = count;i >0; i--){
					j = Math.floor(Math.random()*len);
					str += this.passwordRange.charAt(j);
				}

				// set value to input filed
				this.set('value',str);
			},

			_makeChars : function(){
				var map = lang.clone(this.randCharMap),
					n = 0, i, dd, dt, str = '';

				if(!this.charType) return;

				for(i in map){
					if(!this[i]){ 
						delete map[i]; 
					}else{
						n++;
					}
				}
				
				switch(this.charType){
					case 'ALL_SELECTED_CHARACTER_TYPES' :
						break;
					case 'ANY_SELECTED_CHARACTER_TYPES' :
						break;
					case 'ONLY_ONE_CHARACTER_TYPE':
						n = 1;
						break;
					default:
						break;
				}
				
				for(i in map){
					if(n > 0){
						str += map[i];
					}
					n--;
				}

				return str;

			}

		});
});
