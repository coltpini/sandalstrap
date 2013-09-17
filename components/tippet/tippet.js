var ssTippet = function(){};
ssTippet.config = {
	tag: "ss-tippet",
	template:	'<div class="tippetArrow"></div><heading>{{heading}}<span class="close">x</span></heading><content></content>',
	attributes: ["heading"],
	init: function(elem){
        //close button
        elem.find('heading .close').addListener('click',function(e){
            fw.stopCancel(e);
            elem.tippet.hide();
        });
    }
};

sandlestrap.register(ssTippet);



var Tippet = function(elem, opts){
    this.elem = elem;
    this.options = {
        position: 'bottom',
        area: 'after',
        arrow: true,
        close: true,
        heading: "",
        content: "",
        wide: false,
        onShow : function(){}
    };
    fw.extend(this.options, opts);
    this.elem.addClass('tippetElem');
    if(this.elem.style.position === "static" || fw.cssStyle(this.elem, 'position') === "static")
        this.elem.style.position = "relative";
};

Tippet.prototype.show = function(){
    if(this.elem.find('[ss-tippet]').length < 1)
        this.render();
};
Tippet.prototype.hide = function(e){
    this.elem.removeChild(this.tippet);
    if(e)
        fw.stopCancel(e);
};

Tippet.prototype.render = function(){
    this.tippet = fw('<ss-tippet>');
    var t = this.tippet;
    t.tippet = this;

    t.innerHTML = this.options.content;
    t.setAttribute('heading',this.options.heading);

    if(this.options.wide)
        t.addClass('wide');

    t.addClass(this.options.position).addClass(this.options.area);

    this.elem.appendChild(t);

    if(fw.cssStyle(this.elem,'position' === 'static') || this.elem.style.position === 'static'){
        this.elem.style.position = 'relative';
    }
    (fw.proxy(this.options.onShow, t))();
};

Tippet.prototype.collision = function(){};


