var ssWindow = function(){};
ssWindow.config = {
	tag: "ss-window",
	template:	"<header>{{heading}}</header>" +
				"<section>" +
					"<content></content>" +
					"<ss-button>Templated Button</ss-button>" +
				"</section>",
	attributes: ["heading"]
};

sandlestrap.register(ssWindow);