var ssNotice = function(){};
ssNotice.config = {
	tag: "ss-notice",
	template:	"<header>{{heading}}</header>" +
				"<section>" +
					"<content></content>" +
				"</section>" +
				'<section class="noticeAction">' +
					'<button class="yes">yes</button>' +
					'<button class="no">no</button>' +
				"</section>",
	attributes: ["heading"]
};

sandlestrap.register(ssNotice);