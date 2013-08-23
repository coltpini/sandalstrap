var ssButton = function(){};
ssButton.templates = {
	submit : '<button class="submit"><content></content></button>',
	cancel : '<button class="cancel"><content></content></button>',
	button : '<button><content></content></button>'
};
ssButton.config = {
	tag: "ss-button",
	template:	ssButton.templates.button,
	attributes: ["type"]
};



sandlestrap.register(ssButton);