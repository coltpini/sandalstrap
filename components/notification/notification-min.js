var ssNotification=function(){};ssNotification.config={tag:"ss-notification",template:"<content></content>",init:function(a){a.notify=new Notify(a),a.modal=new Modal(a)}},sandlestrap.register(ssNotification);var Notify=function(a){this.container=a.find("[content]")[0]};Notify.prototype.showMessage=function(a,b,c){var d=fw("<ss-notice>");d.setAttribute("heading",a),d.setAttribute("type",c),d.innerHTML=b,this.container.appendChild(d),this.hideMessage(d);var e=fw.styleProp("transition");e.is&&(d.style[e.prop]="all 200ms ease-out");var f=this;return setTimeout(function(){f.unhideMessage(d)},1),d},Notify.prototype.unhideMessage=function(a){a.opacity(1),a.style.right=0,a.removeClass("hidden")},Notify.prototype.hideMessage=function(a){a.opacity(0),a.style.right=-1*a.offsetWidth+"px",a.addClass("hidden")},Notify.prototype.removeMessage=function(a){this.hideMessage(a),setTimeout(function(){a.parentNode.removeChild(a)},500)},Notify.prototype.handler=function(a,b,c,d){b&&b(c),this.hideMessage(a);var e=this;setTimeout(function(){e.removeMessage(a)},100),d&&clearTimeout(d)},Notify.prototype.alert=function(a,b,c,d){"undefined"==typeof d&&(d=function(a){return a});var e,f=this.showMessage(a,b,"alert"),g=this;"boolean"==typeof c&&c===!0?e=setTimeout(function(){g.removeMessage(f),d()},5e3):"number"==typeof c&&(e=setTimeout(function(){g.removeMessage(f),d()},c)),f.addListener("click",function(a){a.target===f.find(".noticeAction button.yes")&&this.handler(f,d,!0,e)},!1,this)},Notify.prototype.prompt=function(a,b,c,d){"undefined"==typeof d&&(d=function(a){return a}),"undefined"==typeof c&&(c="");var e=this.showMessage(a,b,"prompt");e.addListener("click",function(a){if(a.target===e.find(".noticeAction button.yes")){var b=e.find("section input");this.handler(e,d,b.value)}else a.target===e.find(".noticeAction button.no")&&this.handler(e,d,!1)},!1,this)},Notify.prototype.confirm=function(a,b,c){"undefined"==typeof c&&(c=function(a){return a});var d=this.showMessage(a,b,"confirm");d.addListener("click",function(a){a.target===d.find(".noticeAction button.yes")?this.handler(d,c,!0):a.target===d.find(".noticeAction button.no")&&this.handler(d,c,!1)},!1,this)};var Modal=function(a){this.container=a.find("[content]")[0]};Modal.prototype.showModal=function(a,b,c){var d=fw("<ss-modal>");d.setAttribute("heading",a),d.setAttribute("type",c),d.innerHTML=b,this.container.appendChild(d),this.hideModal(d);var e=fw.styleProp("transition");e.is&&(d.style[e.prop]="opacity 200ms ease-out");var f=this;return setTimeout(function(){f.unhideModal(d)},1),d},Modal.prototype.unhideModal=function(a){a.opacity(1),a.removeClass("hidden")},Modal.prototype.hideModal=function(a){a.opacity(0),a.addClass("hidden")},Modal.prototype.removeModal=function(a){this.hideModal(a),setTimeout(function(){a.parentNode.removeChild(a)},500)},Modal.prototype.handler=function(a,b,c){b&&b(c),this.removeModal(a)},Modal.prototype.alert=function(a,b,c){"undefined"==typeof c&&(c=function(a){return a});var d,e=this.showModal(a,b,"alert");e.addListener("click",function(a){(a.target===e.find(".modalAction button.submit")||a.target===e.find(".modalAction button.submit content"))&&(fw.stopCancel(a),this.handler(e,c,!0,d))},!1,this)},Modal.prototype.prompt=function(a,b,c,d){"undefined"==typeof d&&(d=function(a){return a}),"undefined"==typeof c&&(c="");var e=this.showModal(a,b,"prompt");e.addListener("click",function(a){if(a.target===e.find(".modalAction button.submit")||a.target===e.find(".modalAction button.submit content")){var b=e.find("section input");this.handler(e,d,b.value)}else(a.target===e.find(".modalAction ss-button.cancel button")||a.target===e.find(".modalAction ss-button.cancel content"))&&this.handler(e,d,!1)},!1,this)},Modal.prototype.confirm=function(a,b,c){"undefined"==typeof c&&(c=function(a){return a});var d=this.showModal(a,b,"confirm");d.addListener("click",function(a){a.target===d.find(".modalAction button.submit")||a.target===d.find(".modalAction button.submit content")?this.handler(d,c,!0):(a.target===d.find(".modalAction ss-button.cancel button")||a.target===d.find(".modalAction ss-button.cancel content"))&&this.handler(d,c,!1)},!1,this)};