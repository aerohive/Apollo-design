define(['dojo/_base/declare',
		'dijit/_WidgetBase',
		'dijit/_TemplatedMixin',
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/Evented',
		'ah/util/form/device/Port',
		'ah/util/form/device/WirelessPort',
		'ah/util/form/device/PortTip'],
	function( declare, _WidgetBase, _TemplateMixin, on, lang, array, Evented, Port, WirelessPort, PortTip ){

		return declare('ah/util/form/device/APTmpl',[ _WidgetBase, _TemplateMixin, Evented ],{

			num : 2,
			throld: 148,

			step: 47,
			extraArea: ['rect', 'reset', 'usb', 'console'],
			bTip : true,

			loadBalanceMode: 'AUTO',

			templateString : '<div class="AH_template AP330">'+

								'<div class="port-content">' +
									'<div data-dojo-attach-point="extraWrap">'+
										'<div class="AH-ports-icons port-power"></div>' +
									'</div>' +
									'<ul class="clearfix" data-dojo-attach-point="portWrap"></ul>'+
									'<ul class="clearfix" data-dojo-attach-point="wirelessWrap"></ul>' +
								'</div>'+

							'</div>',
			descString: '<span class="AH-ports-desc desc-{{type}}">{{type}}</span>',
			areaString: '<div class="AH-ports-icons port-{{type}}"></div>',

			postCreate : function(){
				this._rendData();

				this._createPortTip();

				this._rendPorts();

			},

			_rendData : function(){

				if(this.portData){
					var data;

					data = this._portData = {};

					array.forEach(this.portData,function(port){
						var type = port.portType,
							ports = port.ports;

						array.forEach(ports,function(i){
							data[i] = {
								enable : port.portType.enabled,
								type : port.portType,
								ptid : port.portType.id
							};
							if(port.agg || port.red){
								var aggList = ports.clone();
								aggList.splice(i, 1);
								var type = port.agg ? 'agg' : 'red';
								data[i][type] = aggList.join(',');
							}
						});

					}, this);
				}
				if(this.radioData){
					var data;
					data = this._radioData = {};
					array.forEach(this.radioData,function(radio,idx){
						data[idx] = {
							enable: 'enable',
							type: radio
						};
					}, this);
				}

			},

			_rendPorts : function(){

				var i = 0;

				this._ports = [];
				this._radioPorts = [];

				array.forEach(this.extraArea, lang.hitch(this, function(item){
					var str = this.areaString.replace('{{type}}', item);
					if(item == 'console' || item == 'usb'){
						str = this.descString.replace(/{{type}}/g, item) + str;
					}
					this.extraWrap.innerHTML += str;
				}));

				for( ; i<= this.num - 1; i++ ){
					left = this.step * i + this.throld;
					obj = new Port(lang.mixin({
						index : i,
						desc: 'ETH',
						position : 'up',
						left : left,
						right: 'auto',
						theme : 'white',
						ptid : i,
						deviceTmpl : this,
						portTip : this.portTip
					},this._portData ? this._portData[i] : {}));

					this.portWrap.appendChild(obj.domNode);
					obj.startup();

					this._ports.push(obj);

				}
				array.forEach(['2.4','5'], lang.hitch(this, function(type,i){
					var right = 57 - this.step * i;
					obj = new WirelessPort(lang.mixin({
						right: right,
						index: i,
						position: 'up',
						portTip: this.portTip,
						mode: type,
					},this._radioData ? this._radioData[i] : {}));

					this.wirelessWrap.appendChild(obj.domNode);
					obj.startup();

					this._radioPorts.push(obj);
				}));


			},

			_createPortTip : function(){
				if(this.bTip){
					this.portTip = new PortTip();
				}
			},


			deselectAll : function(){
				array.forEach(this._ports, function(port){
					port.selected && port.set('selected', false);
				});
				array.forEach(this._radioPorts, function(port){
					port.selected && port.set('selected', false);
				});
			},

			setSelectedAgg : function(type){
				var selectedIndex = [0, 1];
				array.forEach(this.getSelectedPorts(), function(port,idx){
					var arr = lang.clone(selectedIndex);
					arr.splice(idx, 1);
					delete port[type == 'agg' ? 'red' : 'agg'];
					port.set(type, 0);
					port.set('aggPorts', arr.join(','));
					port.set('lastModify', +new Date());
				});
				this.emit('handleData', this.__getPortsInfo(), 'port');
			},

			setPortType: function(ports, type, breakAgg){
				array.forEach(ports, function(port){
					port.set('type', type);
					port.set('lastModify', +new Date());
				});

				if(breakAgg){
					array.forEach(this._ports, function(port){
						delete port.agg;
						delete port.red;
					});
				}

				this.emit('handleData', this.__getPortsInfo(), 'port');
			},

			setExistPortType: function(arr, type){
				var ports = [];
				array.forEach(arr, lang.hitch(this, function(idx){
					ports.push(this._ports[idx]);
				}));
				this.setPortType(ports, type, false);
			},

			setSelectedPortType : function(type){
				this.setPortType(this.getSelectedPorts(), type, true);
			},

			setRadioProfile: function(port, type){
				port.set('type', type);
				port.set('lastModify', +new Date());
				this.emit('handleData', this.__getRadioInfo(),'radio');
			},

			setExistRadioProfile: function(port, type){
				port = this._radioPorts[port];
				this.setRadioProfile(port, type);
			},

			setSelectedRadioProfile: function(type){
				var port = this.getSelectedPorts('radio')[0];
				this.setRadioProfile(port, type);

			},

			getSelectedPorts : function(type){
				var obj = type ? this._radioPorts : this._ports;
				return array.filter(obj, function(port){
					return port.selected;
				});
			},

			_togglePortSelected : function(e){

				array.forEach(this._ports,function(port){
					port.inRect(e.rect) && port.toggleSelected();
				});

			},

			__getRadioInfo: function(){
				var dataList = [];
				array.forEach(this._radioPorts, function(port){
					dataList.push(port.type);
				});
				return dataList;
			},

			__getPortsInfo : function(){
				var dataList = [];

				if(this._ports[0].hasOwnProperty('agg') || this._ports[0].hasOwnProperty('red')){
					var data = {
						portType: this._ports[0].type,
						ports: [0, 1],
					};
					data[this._ports[0].hasOwnProperty('agg') ? 'agg' : 'red'] = 0;
					dataList.push(data);
				}else{
					if(this._ports[1] && this._ports[1].type.id == this._ports[0].type.id){
						dataList.push({
							portType: this._ports[1].type,
							ports: [0, 1]
						});
					}else{
						array.forEach(this._ports, lang.hitch(this, function(i,idx){
							var data = {
								portType: i.type,
								ports: [idx]
							};
							dataList.push(data);
						}));
					}

				}

				return dataList;
			}

		});

});
