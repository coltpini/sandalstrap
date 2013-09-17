var ssMenu = function(){};
ssMenu.templates = {
	buttonReveal :	'<span class="navButton">' +
						'<ss-icon type="menu" scheme="{{scheme}}"></ss-icon>' +
						'{{label}}' +
					'</span>' +
					'<nav>' +
						'<content></content>' +
					'</nav>' +
					'<div class="menuCover"></div>'
};

ssMenu.config = {
	tag: "ss-menu",
	template:	ssMenu.templates.buttonReveal,
	attributes: ["direction","label","scheme"],
	init: function(elem){
		if(elem.getAttribute('direction') === "right")
			fw('body').addClass('right');

		elem.find('.navButton').addListener('click',function(){
			fw('body').toggleClass('menuOpen');
		});
	}
};

sandlestrap.register(ssMenu);