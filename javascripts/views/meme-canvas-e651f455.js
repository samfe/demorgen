var headlineBase=0,nameBase=0;MEME.MemeCanvasView=Backbone.View.extend({initialize:function(){var t=document.createElement("canvas"),e=MEME.$("#meme-canvas");t&&t.getContext?(e.html(t),this.canvas=t,this.setDownload(),this.render()):e.html(this.$("noscript").html()),this.listenTo(this.model,"change",this.render)},setDownload:function(){var t=document.createElement("a");"undefined"==typeof t.download&&this.$el.append('<p class="m-canvas__download-note">Right-click button and select "Download Linked File..." to save image.</p>')},render:function(){function t(t){var e=h.background.height,a=h.background.width;if(e&&a){var i=e*r.imageScale,n=a*r.imageScale,o=r.backgroundPosition.x||r.width/2,l=r.backgroundPosition.y||r.height/2;t.drawImage(h.background,0,0,a,e,o-n/2,l-i/2,n,i)}}function e(t){r.overlayColor&&(t.save(),t.globalAlpha=1,t.fillStyle=r.themeData[r.theme].background,t.fillRect(0,0,r.width,r.height),t.globalAlpha=1,t.restore())}function a(t){var e=Math.round(.6*r.width),a=s+20,i=s;t.font=r.fontSize+"pt "+r.fontFamily,t.fillStyle=r.themeData[r.theme].main,t.textBaseline="top",r.textShadow&&(t.shadowColor="#666",t.shadowOffsetX=-2,t.shadowOffsetY=1,t.shadowBlur=10),"center"==r.textAlign?(t.textAlign="center",a=r.width/2,i=r.height-r.height/1.3,e=r.width-r.width/3):"right"==r.textAlign?(t.textAlign="right",a=r.width-s):t.textAlign="left";for(var n=r.headlineText.split(" "),o="",l=0;l<n.length;l++){var h=o+n[l]+" ",d=t.measureText(h),c=d.width;c>e&&l>0?(t.fillText(o,a,i-10),o=n[l]+" ",i+=Math.round(1.5*r.fontSize)):o=h}t.fillText(o,a,i-10),t.shadowColor="transparent",headlineBase=i+Math.round(1.5*r.fontSize)-10}function i(t){var e,a,i,n;if(a=n=h.watermark.height,e=i=h.watermark.width,a&&e){var o=r.width*r.watermarkMaxWidthRatio;e>o&&(n=a*(o/e),i=o),t.globalAlpha=r.watermarkAlpha,t.drawImage(h.watermark,0,0,e,a,20,r.height-20-n,i,n),t.globalAlpha=1}}function n(t){if("center"!==r.textAlign){switch(t.textAlign="left",t.fillStyle=r.themeData[r.theme].quote,r.fontFamily){case"SundayTimesModern-Medium":var e=s-22,a=s-22;break;default:var e=s-14,a=s-10}t.font="normal "+2.7*r.fontSize+"pt "+r.fontFamily,t.fillText(r.quotemarkText,e,a)}}function o(t){t.fillStyle=r.themeData[r.theme].secondary,t.font="normal "+Math.round(1.5*r.nameSize)+"pt "+r.fontFamily,nameBase=headlineBase+Math.round(2.2*r.nameSize);var e=s+20,a=headlineBase;"center"==r.textAlign?(t.textAlign="center",e=r.width/2):"right"==r.textAlign?(t.textAlign="right",e=r.width-s):t.textAlign="left",t.fillText(r.nameText,e,a)}function l(t){t.fillStyle=r.creditColor,t.font="normal "+r.creditSize+"pt "+r.fontFamily;var e=s+20,a=nameBase;"center"==r.textAlign?(t.textAlign="center",e=r.width/2):"right"==r.textAlign?(t.textAlign="right",e=r.width-s):t.textAlign="left",t.fillText(r.creditText,e,a)}if(this.canvas){var h=this.model,r=this.model.toJSON(),d=this.canvas.getContext("2d"),s=Math.round(r.width*r.paddingRatio);this.canvas.width=r.width,this.canvas.height=r.height,d.clearRect(0,0,r.width,r.height),e(d),t(d),a(d),i(d),n(d),o(d),l(d);var c=this.canvas.toDataURL();this.$("#meme-download").attr({href:c,download:(r.downloadName||"share")+".png"}),this.canvas.style.cursor=this.model.background.width?"move":"default"}},events:{"mousedown canvas":"onDrag"},onDrag:function(t){function e(t){t.preventDefault(),a.set("backgroundPosition",{x:o.x-(n.x-t.clientX),y:o.y-(n.y-t.clientY)})}if(t.preventDefault(),this.model.hasBackground()){var a=this.model,i=a.toJSON(),n=(a.background.width*i.imageScale/2,a.background.height*i.imageScale/2,{x:t.clientX,y:t.clientY}),o=i.backgroundPosition;o.x=o.x||i.width/2,o.y=o.y||i.height/2;var l=MEME.$(document).on("mousemove.drag",e).on("mouseup.drag",function(t){l.off("mouseup.drag mousemove.drag"),e(t)})}}});