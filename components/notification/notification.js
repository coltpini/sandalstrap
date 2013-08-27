var ssNotification = function(){};
ssNotification.config = {
	tag: "ss-notification",
	template:	"<content></content>",
	init: function(elem){
		elem.notify = new Notify(elem);
	}
};

sandlestrap.register(ssNotification);

//This is the script to use the notifications
var Notify = function(cont){
	this.container = cont.find('[content]')[0];
};

Notify.prototype.showMessage = function(bannerTitle, bannerMessage, bannerType) {
	var notice = fw('<ss-notice>');
	notice.setAttribute('heading', bannerTitle);
	notice.setAttribute('type',bannerType);
	notice.innerHTML = bannerMessage;
	this.container.appendChild(notice);

	this.hideMessage(notice);

	var trans = fw.styleProp('transition');
	if(trans.is)
		notice.style[trans.prop] = "all 200ms ease-out";

	var _t = this;
	setTimeout(function(){_t.unhideMessage(notice);},1);

	return notice;
};

Notify.prototype.unhideMessage = function(elem) {
	elem.opacity(1);
	elem.style.right = 0;
	elem.removeClass('hidden');
};
Notify.prototype.hideMessage = function(elem) {
	elem.opacity(0);
	elem.style.right = (-1 * elem.offsetWidth) + "px";
	elem.addClass('hidden');
};
Notify.prototype.removeMessage = function(elem) {
	this.hideMessage(elem);
	setTimeout(function(){elem.parentNode.removeChild(elem);}, 500);
};

Notify.prototype.handler = function(elem,callback,val,t){
	if(callback){callback(val);}
	this.hideMessage(elem);
	var _t = this;
	setTimeout(function(){ _t.removeMessage(elem);},100);
	if(t)
		clearTimeout(t);
};

Notify.prototype.alert = function(title, bannerMessage, autohide, callback){
	if(typeof(callback) === "undefined")callback = function(val){return val;};

	var elem = this.showMessage(title, bannerMessage, "alert"),t,th = this;
	if(typeof(autohide) === "boolean" && autohide === true){
		t = setTimeout(function(){th.removeMessage(elem);callback();}, 5000);
	}
	else if(typeof(autohide) === "number"){
		t = setTimeout(function(){th.removeMessage(elem);callback();}, autohide);
	}
	elem.addListener('click',function(e){
		if(e.target === elem.find('.noticeAction button.yes'))
			this.handler(elem,callback,true,t);
	},false,this);
};

Notify.prototype.prompt = function(title, question, callback){
	if(typeof(callback) === "undefined")callback = function(val){return val;};
	
	var elem = this.showMessage(title, question, "prompt");

	elem.addListener('click',function(e){
		if(e.target === elem.find('.noticeAction button.yes')){
			var input = elem.find('section input')
			this.handler(elem,callback,input.value);
		}
		else if(e.target === elem.find('.noticeAction button.no')){
			this.handler(elem,callback,false);
		}
	},false,this);

	//validation?
};

Notify.prototype.confirm = function(title, question, callback){
	if(typeof(callback) === "undefined")callback = function(val){return val;};

	var elem = this.showMessage(title, question,"confirm");
	elem.addListener('click',function(e){
		if(e.target === elem.find('.noticeAction button.yes')){
			this.handler(elem,callback,true);
		}
		else if(e.target === elem.find('.noticeAction button.no')){
			this.handler(elem,callback,false);
		}
	},false,this);
};