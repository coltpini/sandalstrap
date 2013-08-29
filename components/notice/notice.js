var ssNotice = function(){};

ssNotice.templates = {
	alert:	"<header>{{heading}}</header>" +
			"<section>" +
				"<content></content>" +
			"</section>" +
			'<section class="noticeAction">' +
				'<button class="yes">yes</button>' +
			"</section>",

	prompt: "<header>{{heading}}</header>" +
			"<section>" +
				"<content></content>" +
				'<input type="text" />' +
			"</section>" +
			'<section class="noticeAction">' +
				'<button class="yes">yes</button>' +
				'<button class="no">no</button>' +
			"</section>",

	confirm:	"<header>{{heading}}</header>" +
				"<section>" +
					"<content></content>" +
				"</section>" +
				'<section class="noticeAction">' +
					'<button class="yes">yes</button>' +
					'<button class="no">no</button>' +
				"</section>",
};

ssNotice.config = {
	tag: "ss-notice",
	template:	ssNotice.templates.alert,
	attributes: ["heading", "type"],
	init: function(elem){
		if(elem.getAttribute('type') === 'prompt'){
			elem.find('input').addListener('keyup', function(e){
				if(fw.key(e).code === 13){
					fw.stopCancel(e);
					elem.find('.noticeAction button.yes').simulateEvent('click');
				}
			});
		}
	}
};

sandlestrap.register(ssNotice);