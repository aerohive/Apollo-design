define([
	"dojo/_base/lang",
	'dojo/_base/array'
], function ( lang, array) {

	var obj = {};

	var add = function(name,cfg){
		lang.setObject(
			name,
			lang.mixin({},cfg),
			obj
		);
	};


    add('components', { items : [
        {category : 'Components', list : [
			{label : 'Tab 选项卡', type : '', current : true, widget : 'components/tab'}
		]},
		{category : 'Styles', list : [
			{label : 'Layout 布局', widget : 'styles/layout'}
		]}        
    ]});


    add('experience', { items : [
		{category : 'Base Structure', list : [
			{label : 'Base', current : true, widget : 'experience/base'}
		]}        
    ]});
    

    return obj;

});
