var ssModal = function(){};

ssModal.templates = {
	alert:	'<ss-window heading="{{heading}}">' +
				'<content></content>' +
				'<div class="modalAction">' +
					'<ss-button type="submit" class="yes">ok</ss-button>' +
				'</div>' +
			'</ss-window>',
	prompt: '<ss-window heading="{{heading}}">' +
				'<content></content>' +
				'<input type="text" />' +
				'<div class="modalAction">' +
					'<ss-button class="cancel">cancel</ss-button>' +
					'<ss-button type="submit" class="yes">ok</ss-button>' +					
				'</div>' +
			'</ss-window>',
	confirm:'<ss-window heading="{{heading}}">' +
				'<content></content>' +
				'<div class="modalAction">' +
					'<ss-button type="cancel" class="cancel">No</ss-button>' +
					'<ss-button type="submit" class="submit">Yes</ss-button>' +					
				'</div>' +
			'</ss-window>',
};

ssModal.config = {
	tag: "ss-modal",
	template:	ssModal.templates.alert,
	attributes: ["heading", "type"],
	init: function(elem){
		if(elem.getAttribute('type') === 'prompt'){
			elem.find('input').addListener('keyup', function(e){
				if(fw.key(e).code === 13){
					fw.stopCancel(e);
					elem.find('.modalAction button.submit').simulateEvent('click');
				}
			});
		}
	}
};

sandlestrap.register(ssModal);