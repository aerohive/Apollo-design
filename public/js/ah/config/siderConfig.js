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
			{label : 'Chosen 选择列表', type : '', widget : 'components/chosen'},
			{label : 'Carousel 轮播', type : '', widget : 'components/carousel'},
			{label : 'ObscureInput 密码框', type : '', widget : 'components/obscureInput'},
			{label : 'Tab 选项卡', type : '', current : true, widget : 'components/tab'},
			{label : 'Tooltip 提示框', type : '', widget : 'components/tooltip'},
			{label : 'Menu 菜单栏', type : '', widget : 'components/menu'},
			{label : 'Upload 上传组件', type : '', widget : 'components/upload'},
			{label : 'TagList 标签', type : '', widget : 'components/tagList'},
			{label : 'SiderList 列表', type : '', widget : 'components/siderList'}
		]},
		{category : 'Styles', list : [
			//{label : 'Layout 布局', widget : 'styles/layout'},
			{label: 'Button 按钮', widget: 'styles/button'},
			{label: 'Tipbox 提示框', widget: 'styles/tipbox'},
			{label: 'Title 标题', widget: 'styles/title'}
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
