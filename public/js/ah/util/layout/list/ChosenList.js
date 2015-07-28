define([ "dojo/_base/declare",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/Deferred",
		"dojo/when",
		"ah/util/Chosen",
		"ah/util/common/Base",
        "dijit/_TemplatedMixin",
		"dijit/_WidgetBase"],function(declare, on, lang, array, Deferred, when, Chosen, Base, _TemplateMixin, _WidgetBase){

		return declare('ah/util/layout/list/ChosenList', [_WidgetBase, _TemplateMixin, Base], {

			templateString : '<div><select class="${selectClass}" data-dojo-attach-point="selEl"></select></div>',

			selectClass : 'input_6',

			items : null,

			//target : '',

			mode : null,

			itemKey : null,
			itemVal : null,

			keepValue : true,

			bEmpty : false,


			//@extra data  {Array}
			extraData : null,


			_maps : {
				'standardAttribute': 'services/metadata/standardattributes',
				'realm': 'services/config/device/bonjourgatewaysettings/realmnames',
				'timezone' : 'services/metadata/timezones',
				'applicationGroup': 'services/config/common/applicationservicecategories',

				'radiusServers': 'services/inventory/device/utilities/radius/server/list',
				'radiusClients': 'services/inventory/device/utilities/radius/client/list',

				'certificate': 'services/config/security/cert/certificates/type?fileTypes=CERT',
				'certificateID': 'services/config/security/cert/certificates/type?fileTypes=CERT',
				'keyCert': 'services/config/security/cert/certificates/type?fileTypes=KEY',
				'keyCertID': 'services/config/security/cert/certificates/type?fileTypes=KEY',
				'certKey': 'services/config/security/cert/certificates/type?fileTypes=CERT_KEY,SELF_GEN_CA',
				'policy' : 'services/config/policy/networkpolicies?vocoLevel=1',
				'industry' : 'services/metadata/industries',
			},

			_keyMaps : {
				'standardAttribute': ['key', 'name'],
				'realm': ['realmNameValue', 'realmNameKey'],
				'timezone' : ['timeZoneId', 'displayName'],
				'applicationGroup': ['id', 'name'],

				'radiusServers': ['ipAddress', 'hostname'],
				'radiusClients': ['id', 'hostname'],

				'certificate': ['name','name'],
				'certificateID': ['id','name'],
				'keyCert': ['name','name'],
				'keyCertID': ['id','name'],
				'certKey': ['id','name'],
				'policy' : ['id', 'name'],
				'industry' : ['industryId', 'displayName']
			},

			_getLabelAttr: function (valLabel) {
				var node = this.chosen.domNode;
				return node.options[node.selectedIndex].innerHTML;
			},

			_setLabelAttr : function(label){
				if(!label) return;

				this._when(function(){
					this.chosen.set('value', this.get('listData')[label]);
					this._set('label', label);
				});
			},

			_setForbiddenAttr : function(f){
				this._when(function(){
					this.chosen.set('forbidden', f);
				});
			},

			_getValueAttr : function(){
				var val = this.chosen.domNode.value;
				return val === 'null' ? null : val;
			},

			_setValueAttr : function(v){
				this._when(function(){
					this.chosen.set('value',v);
					this._set('value',v);
				});
			},

			_setListDataAttr : function(d, val, key){
				var o = {};

				array.forEach(d, function(item){
					o[item[key]] = item[val];
				});

				this._set('listData', o);
			},

			_setIdDataAttr : function(data){
				var o = {};

				array.forEach(data, function(item){
					o[item.id] = item;
				});

				this._set('idData', o);
			},

			startup : function(){
				this.inherited(arguments);

				this._when(function(){
					this.chosen.startup();
				});
			},

			postCreate : function(){
				this.inherited(arguments);

				this._deferred = new Deferred();

				var url;

				this._keyVal = this._getKeyAndValue();

				if(url = this.target || (this.target = this._maps[this.mode])){
					this.$get(url, this._rendList);

				}else if(this.items){

					this._rendList(this.items);
				}

				this._bindUI();

			},

			_bindUI : function(){
				var _self = this;

				this._when(function(){
					this.own(
						on(this.chosen.domNode, 'change', function(e){
							_self.onChange(e.target.value);
						})
					);
				});
			},

			_rendList : function(data){
				var d = data.data ? data.data : data;

				this._firstItem = d[0];

				if(this.extraData){
					d = this.extraData.concat(d);
				}

				this.fetchData(d, lang.hitch(this,this._rendChosen));

			},

			_rendChosen : function(d){

				this.selEl.innerHTML = this._makeOptions(d);

				!this.chosen && this._createChosen();
			},

			_makeOptions : function(data){
				var str = '', o = {},
					arr = this._keyVal;

				if(this.bEmpty && !this.newOption){
					o[arr[0]] = null;
					o[arr[1]] = '--'
					data.unshift(o);
				}

				if(this.newOption && !this.bEmpty){
					o[arr[0]] = '_new_';
					o[arr[1]] = this.newOption[0];
					data.unshift(o);
				}

				this.set('listData', data, arr[0], arr[1]);
				this.set('idData', data);

				array.forEach(data, function(item){

					str += '<option value="'+item[arr[0]]+'">'+item[arr[1]]+'</option>'

				},this);

				return str;

			},

			_createChosen : function(){

				if(this.newOption){
					(this.toggleProp || (this.toggleProp = {}))['_new_'] = this.newOption[1];
				}

				this.chosen = new Chosen({toggleProp:this.toggleProp},this.selEl);

				if(this.newOption){
					this.chosen.set('value', this._firstItem[this._keyVal[0]]);
				}

				

				this._deferred.resolve(this.chosen);
			},

			_getKeyAndValue : function(){
				var arr, val = this.itemVal, label = this.itemKey;

				if(this.mode && (arr = this._keyMaps[this.mode])){
					val = arr[0];
					label = arr[1];
				}

				return [val, label];
			},

			_when : function(fn){
				when(this._deferred, lang.hitch(this, fn));
			},

			add : function(obj){
				var arr = this._keyVal;

				if(Array.isArray(obj)){
					array.forEach(obj, function(item){
						this.add(item);
					}, this);

					return;
				}

				this._when(function(){
					var option = new Option(obj[arr[1]], obj[arr[0]]);
					this.chosen.addOption(option);
				});
			},

			refresh : function(){
				var val = this.get('value');

				this._when(function(){
					this.$get(this.target, this._rendList).then(lang.hitch(this, function(){

						val && this.keepValue ? this.set('value', val) :
								this.$publish('liszt:updated', this.chosen.domNode);

					}));
				});
			},

			fetchData : function(d, callback){
				callback(d);
			},

			done : function(fn){
				this._deferred.then(fn);
			},

			onChange : function(){}


		});

});
