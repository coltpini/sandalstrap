var ssCollapseGroup = function(){};
ssCollapseGroup.templates = {
    selfMade : '<section>' +
                    '<header><h4>{{heading}}</h4><span class="close">x</span></header>' +
                    '<content></content>' +
                '</section>',
    useWindow : '<ss-window heading="{{heading}}"><content></content></ss-window>',
};
ssCollapseGroup.config = {
	tag: "ss-collapsegroup",
	template: ssCollapseGroup.templates.useWindow,
	attributes: ["heading"],
	init: function(elem){
        
    }
};

sandlestrap.register(ssCollapseGroup);