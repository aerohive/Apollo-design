define(['dojo/dom-class'], function(domClass) {
	var btnFix = {
		bBtnFix: false,
		_setBBtnFixAttr: function(b) {
			if (b) {
				var btnEl = this.buttonEl;
				btnEl && domClass.remove(btnEl, 'btn-mir-leave');
				btnEl && domClass.remove(btnEl, 'btn-mir');
			}
		}
	}

	return btnFix;
});
