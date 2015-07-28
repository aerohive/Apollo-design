define(['dojo/_base/declare',
		'dijit/_WidgetBase',
		'dijit/_TemplatedMixin',
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/Evented',
		'ah/util/form/device/Port',
		'ah/util/form/MouseSelect',
		'ah/util/form/device/PortTip'],
	function( declare, _WidgetBase, _TemplateMixin, on, lang, array, Evented, Port, MouseSelect, PortTip ){

		return declare('ah/util/form/device/DeviceTmpl',[ _WidgetBase, _TemplateMixin, Evented ],{

			num : 28,

			step : 23,

			throld : 22,

			mouseSelect : false,

			bTip : true,

			loadBalanceMode: 'AUTO',

			// mirrorData: { portTypeId: [{dest: 1, ingressPorts: [],egressPorts: [], egressAndIngressPorts: [], vlan: 1}]},

			templateString : '<div class="AH_template AH_48_switch_template">'+
								'<div class="console-port exp">' +
									'<ul class="line-up"><li class="AH-ethernet-port"><ul> <li> <span class="line-up-port-nbr port-nbr">CSL</span></li><li><span class="AH-ports-icons ethernet-port-up"></span></li></ul></li> <li class="AH-usb-port"><ul><li><span class="AH-ports-icons usb-port-gray"></span></li></ul></li></ul>'+
								'</div>' +
								'<div class="ethnet-port"><ul class="clearfix" data-dojo-attach-point="portWrap"></ul></div>'+
							'</div>',

			postCreate : function(){
				this._rendData();

				this._createPortTip();

				this._rendPorts();

				this._createMouseSelect();

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
								enable : type.enable,
								type : type,
								ptid : type.id
							}
							if(port.agg){
								var aggList = lang.clone(port.ports);
								aggList.splice(i, 1);
								data[i].agg = port.agg;
								data[i].aggPorts = aggList.join(',');
							}
						});

					}, this);
				}

			},

			_rendPorts : function(){

				var i = 1, odd, d, b, obj, isGray, left;

				this._ports = [];

				for( ; i<= this.num; i++ ){
					odd = i % 2;
					d = Math.ceil(i/2) - 1;
					b = Math.ceil(i/12) - 1;
					isGray = i > (this.num - 4);
					left = d * this.step + this.throld * b;
					right = this.num - i < 2 ? 10 : 10 + this.throld;
					// TODO I have left agg
					obj = new Port(lang.mixin({
						index : i,
						desc: '',
						position : odd ? 'up' : 'down',
						left : !isGray ? left : 'auto',
						right: !isGray ? 'auto' : right,
						theme : !isGray ? 'white' : 'gray',
						ptid : i,  // would be override by this.data, this is for fake data
						deviceTmpl : this,
						portTip : this.portTip
					},this._portData ? this._portData[i] : {}));

					this.portWrap.appendChild(obj.domNode);
					obj.startup();

					this._ports.push(obj);

				}

			},

			_createPortTip : function(){
				if(this.bTip){
					this.portTip = new PortTip();
				}
			},

			_createMouseSelect : function(){
				if(this.mouseSelect){
					this._mouseSelectObj = new MouseSelect(this.domNode,{
						mouseStop : lang.hitch(this,this._togglePortSelected)
					});
				}
			},

			deselectAll : function(){
				array.forEach(this._ports, function(port){
					port.selected && port.set('selected', false);
				});
			},

			setSelectedAgg : function(aggNum,loadBalanceMode,ports){
				var selectedPorts, selectedIndex;
				if(ports){
					selectedPorts = [];
					array.forEach(ports, lang.hitch(this, function(i){
						selectedPorts.push(this._ports[i - 1]);
					}));
					selectedIndex = ports;
				}
				else{
					var selectedPorts = this.getSelectedPorts(),
					selectedIndex = array.map(selectedPorts, function(port){
						return port.index;
					});
				}

				array.forEach(selectedPorts, function(port,idx){
					var arr = lang.clone(selectedIndex);
					arr.splice(idx, 1);
					port.set('agg', aggNum);
					port.set('aggPorts', arr.join(','));
					port.set('lastModify', +new Date());
				});
				loadBalanceMode && (this.loadBalanceMode = loadBalanceMode);
				this.emit('handleData', this.__getPortsInfo());
			},

			setPortType: function(ports, type, mirrorData, breakAgg){
				array.forEach(ports, lang.hitch(this, function(port){
					port.set('type', type);
					port.set('lastModify', +new Date());
					breakAgg && delete port.agg;
					if(type.jsonType !== 'mirror-port'){
						this.mirrorData && delete this.mirrorData[port.index];
					}
				}));

				if(mirrorData){
					this.mirrorData = mirrorData;
				}

				this.emit('handleData', this.__getPortsInfo());
			},

			setExistPortType: function(arr, type, mirrorData){
				var ports = [];
				array.forEach(arr, lang.hitch(this, function(idx){
					ports.push(this._ports[idx]);
				}));
				this.setPortType(ports, type, mirrorData, false);
			},

			setSelectedPortType : function(type, mirrorData){
				this.setPortType(this.getSelectedPorts(), type, mirrorData, true);
			},

			getSelectedPorts : function(){
				return array.filter(this._ports,function(port){
					return port.selected;
				});
			},

			_togglePortSelected : function(e){

				array.forEach(this._ports,function(port){
					port.inRect(e.rect) && port.toggleSelected();
				});

			},

			__getPortsInfo : function(){
				var agg = {}, obj = {},
					i, portList, port, dataList = [];

				array.forEach(this._ports, function(item){
					var aggNum = item.agg,
						portType = item.type.id;

					if(aggNum){
						(agg[aggNum] || (agg[aggNum] = [])).push(item);
					}else{
						(obj[portType] || (obj[portType] = [])).push(item);
					}
				});

				for(i in agg){
					portList = agg[i];
					if(portList.length == 1){
						port = portList[0];
						(obj[port.type.id] || (obj[port.type.id] = [])).push(port);
						delete agg[i];
					}else{
						var ports = [];
						array.forEach(portList, function(item){
							ports.push(item.index);
						});
						var dataItem = {
							portType: portList[0].type,
							agg: i,
							ports: ports
						};
						dataList.push(dataItem);
					}
				}
				for(i in obj){
					var ports = [];
					portList = obj[i];
					array.forEach(portList, function(item){
						ports.push(item.index);
					});
					var dataItem = {
						portType: portList[0].type,
						ports: ports
					}
					dataList.push(dataItem);
				}

				return dataList;
			}

		});

});
