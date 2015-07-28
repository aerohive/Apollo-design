define([
		"dojo/_base/lang" ,
        "dojo/dom-class"
		], function(lang, domClass){

	var callback = {};

	callback.xhr = {
		'send' : {
			'disabled' : function(t){
				t.setAttribute('disabled', 'disabled');
				domClass.add(t,'button-wait-spinner');
			},
			'toggle' : function(t){
				t.style.display = '';
			}
		},
		'done' : {
			'disabled' : function(t){
				t.removeAttribute('disabled');
				domClass.remove(t,'button-wait-spinner');
			},
			'toggle' : function(t){
				t.style.display = 'none';
			}
		} 
	};
	
	return callback;

});
