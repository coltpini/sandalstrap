var ssCheckbox = function(){};
ssCheckbox.config = {
	tag: "ss-checkbox",
	template:	'<label for="{{name}}">' +
					'<content></content>' +
				'</label>' +
				'<input type="checkbox" name="{{name}}" />' +
				'<span></span>',
	attributes: ["name"],
	init: function(elem){
		if(elem.getAttribute('value') === "true"){
			var input = elem.find('input');	
			elem.addClass('checked');
			input.setAttribute('checked',true);			
		}
			
		elem.setVal = function(val){
			var input = elem.find('input');				
			input.checked = val;
			elem.value = val;
			elem.toggleClass('checked');
		};
		
		elem.addListener('click',function(){									
			elem.setVal(!elem.containsClass('checked'));						
		});
	}
};

sandlestrap.register(ssCheckbox);