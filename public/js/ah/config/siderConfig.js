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
			{label : 'Tab 选项卡', type : '', current : true, widget : 'components/tab'},
			{label : 'ObscureInput 隐藏输入', type : '', current : true, widget : 'components/obscureInput'}
		]},
		{category : 'Styles', list : [
			{label : 'Layout 布局', widget : 'styles/layout'},
			{label : 'Carousel 轮播', type : '', widget : 'components/carousel'},
			{label: 'Button 按钮', widget: 'styles/button'}
		]}
    ]});


    add('experience', { items : [
		{category : 'Base Structure', list : [
			{label : 'Base', current : true, widget : 'experience/base'}
		]}
    ]});

    /**
     *@For search list
     *@Summary
     */
    var arr = [];

    obj.components.items.forEach(function(item, i){
        arr = arr.concat(item.list);
    });

    add('search', {items : arr});

    return obj;

});
