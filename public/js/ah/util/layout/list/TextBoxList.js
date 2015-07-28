define([
		'dojo/_base/declare', 'ah/util/common/ModuleBase','dojo/on','dojo/_base/lang',
		"dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", 'ah/util/layout/Tag'
		],function(declare, ModuleBase, on, lang, array, domClass, domCon, Tag){

		return declare('ah/util/layout/list/TextBoxList',[ModuleBase],{

			templateString : '<ul class="ui-textbox"><input type="text" class="ui-textbox-input" data-dojo-attach-point="inputEl" placeholder="Press enter to add the typed value"/></ul>',

			// for Tag widget
			jsonType : 'member-of',

			/*
			items : [
				{name : 'hello', jsonType : 'mmmm', id : 121313},
				{name : 'aa', jsonType : 'mmmm', id : 133333},
				{name : 'bb', jsonType : 'mmmm', id : 666666}
			],
			*/

			events : [
				['inputEl', 'keydown', '_handleKeyDown'],
				['domNode', 'click', '_focusInput']
			],

			_getValuesAttr : function(){
				return array.map(this._tags, function(tag){
					return tag.get('value');
				});
			},

			_getObjsAttr : function(){
				// lang.clone would catch error
				return this._tags;
			},

			_setInputFocusAttr : function(f){
				if(f){
					this.inputEl.focus();
				}else{
					this.inputEl.blur();
				}
			},

			postCreate : function(){
				this.inherited(arguments);

				this._tags = [];

				this.rendUI();
			},

			rendUI : function(){
				// this also can be put into _setItemsAttr
				if(this.items){
					this.makeTags(this.items);
				}
			},

			_handleKeyDown : function(e){
				var keycode = e.keyCode,
					val = e.target.value.trim();
				// console.log(keycode);
				switch(keycode){
					case 13:
						this._add(val);
						break;
					case 8:
						this._delete();
						break;
					case 37:
						this._move(true);
						break;
					case 39:
						this._move(false);
						break;
					default:
						break;
				}

			},
			_focusInput: function(){
				this.set('inputFocus', true);
			},

			_validate : function(name){
				if('' === name) return false;
				var flag = this.validRule ? this.validRule() : true;

				return flag;
			},

			_add : function(name){

				if(!this._validate(name)) return;

				this.add(name);

			},

			makeTags : function(data){
				array.forEach(data, function(item){
					this.add(item);
				}, this);
			},

			add : function(name){
				var tag,
					obj = {closeMode : 'abandon'}; 
				
				//= new Tag({name : name, value: name, closeMode : 'abandon'});
				
				if('object' !== typeof name){
					obj = lang.mixin({name : name, value : name, jsonType : this.jsonType}, obj);
				}else{
					obj = lang.mixin({name : name.name, value : name.name, tid : name.id ? name.id : null, jsonType : name.jsonType || this.josnType}, obj);
				}
				
				tag = new Tag(obj);

				tag.on('itemClose', lang.hitch(this, this.remove));

				tag.placeAt(this.inputEl, 'before');

				this._tags.push(tag);

				this.inputEl.value = '';
			},

			remove : function(tag){
				var i = this._tags.indexOf(tag);

				this._tags.splice(i, 1);

				this.set('inputFocus', true);

				tag.destroy();
			},

			_delete: function(){
				var tags = this._tags,
					curTag = tags[tags.length - 1];
				if (this.inputEl.value !== '' || tags.length == 0) return;

				if(this._tags[this.activeTag]){
					this.remove(this._tags[this.activeTag]);
					delete this.activeTag;
					return;
				}
				curTag.active ? this.remove(curTag) : curTag.set('active', true);
			},

			_move: function(f){
				if(f && this.activeTag == 0 || !f && this.activeTag == this._tags.length - 1) return;
				this._setActiveTag(!this.activeTag && f ? (this._tags.length - 1) : f ? (this.activeTag - 1) : (this.activeTag + 1));
			},

			_setActiveTag: function(v){
				this._tags[this.activeTag] && this._tags[this.activeTag].set('active',false);
				this._tags[v].set('active', true);
				this._set('activeTag', v);
			},

			_getCaret : function(el){
				var r;

				if (el.createTextRange){
					r = document.selection.createRange().duplicate();
					r.moveEnd('character', el.value.length);

					if (r.text === '') return el.value.length;

					return el.value.lastIndexOf(r.text);
				} else {
					return el.selectionStart;
				}
			}

		});
});
