var ssButton = function(){};
ssButton.config = {
	tag: "ss-button",
	template:	'<button><content></content></button>',
	attributes: ["type"]
};
ssButton.templates = {
	submit : '<button class="submit"><content></content></button>',
	cancel : '<button class="cancel"><content></content></button>'
};


sandlestrap.register(ssButton);