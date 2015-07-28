define(['dojo/_base/declare',
		'dojo/on',
		'dojo/_base/lang',
		'ah/util/form/device/PortBase',
		'dojo/dom-class'],
	function( declare, on, lang, PortBase, domClass){

		return declare('ah/util/form/device/WirelessPort',[PortBase],{
			pType: 'wireless',
			templateString : '<li class="port-ctn ${position}" style="right: ${right}px;">'+
								'<span class="port-desc">${mode} GHZ</span>'+
								'<div class="AH-ports-icons port-wireless" data-index="${index}" data-dojo-attach-point="portEl">'+
								'</div>'+
							'</li>'

		});

});
