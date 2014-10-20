MEME.MemeEditorView=Backbone.View.extend({initialize:function(){this.buildForms(),this.listenTo(this.model,"change",this.render),this.render()},buildForms:function(){function e(e){return _.reduce(e,function(e,t){return e+=['<option value="',t.hasOwnProperty("value")?t.value:t,'">',t.hasOwnProperty("text")?t.text:t,"</option>"].join("")},"")}var t=this.model.toJSON();if(t.textShadowEdit&&$("#text-shadow").parent().show(),t.textAlignOpts&&t.textAlignOpts.length&&$("#text-align").append(e(t.textAlignOpts)).show(),t.fontSizeOpts&&t.fontSizeOpts.length&&$("#font-size").append(e(t.fontSizeOpts)).show(),t.fontFamilyOpts&&t.fontFamilyOpts.length&&$("#font-family").append(e(t.fontFamilyOpts)).show(),t.themeOpts&&t.themeOpts.length&&$("#theme").append(e(t.themeOpts)).show(),t.watermarkOpts&&t.watermarkOpts.length&&$("#watermark").append(e(t.watermarkOpts)).show(),t.overlayColorOpts&&t.overlayColorOpts.length){var n=_.reduce(t.overlayColorOpts,function(e,t){var n=t.hasOwnProperty("value")?t.value:t;return e+='<li><label><input class="m-editor__swatch" style="background-color:'+n+'" type="radio" name="overlay" value="'+n+'"></label></li>'},"");$("#overlay").show().find("ul").append(n)}if(t.backgroundColorOpts&&t.backgroundColorOpts.length){var o=_.reduce(t.backgroundColorOpts,function(e,t){var n=t.hasOwnProperty("value")?t.value:t;return e+='<li><label><input class="m-editor__swatch" style="background-color:'+n+'" type="radio" name="background" value="'+n+'"></label></li>'},"");$("#background").show().find("ul").append(o)}},render:function(){var e=this.model.toJSON();this.$("#headline").val(e.headlineText),this.$("#name").val(e.nameText),this.$("#credit").val(e.creditText),this.$("#watermark").val(e.watermarkSrc),this.$("#image-scale").val(e.imageScale),this.$("#font-size").val(e.fontSize),this.$("#font-family").val(e.fontFamily),this.$("#theme").val(e.theme),this.$("#text-align").val(e.textAlign),this.$("#text-shadow").prop("checked",e.textShadow),this.$("#overlay").find('[value="'+e.overlayColor+'"]').prop("checked",!0),this.$("#background").find('[value="'+e.backgroundColor+'"]').prop("checked",!0)},events:{"input #headline":"onHeadline","input #credit":"onCredit","input #name":"onName","input #image-scale":"onScale","change #font-size":"onFontSize","change #font-family":"onFontFamily","change #theme":"onTheme","change #watermark":"onWatermark","change #text-align":"onTextAlign","change #text-shadow":"onTextShadow",'change [name="overlay"]':"onOverlayColor",'change [name="background"]':"onBackgroundColor","dragover #dropzone":"onZoneOver","dragleave #dropzone":"onZoneOut","drop #dropzone":"onZoneDrop","click #doubleOpenQuote":"onDoubleOpenQuote","click #doubleCloseQuote":"onDoubleCloseQuote","click #singleOpenQuote":"onSingleOpenQuote","click #singleCloseQuote":"onSingleCloseQuote","click #emdash":"onEmdash"},onDoubleOpenQuote:function(){var e=this.$("#headline")[0].selectionStart,t=this.$("#headline")[0].selectionEnd,n=this.$("#headline").val();return t>e&&(this.$("#headline").val(n.substring(0,t)+"\u201d"+n.substring(t)),n=this.$("#headline").val()),this.$("#headline").val(n.substring(0,e)+"\u201c"+n.substring(e)),this.onHeadline(),!1},onDoubleCloseQuote:function(){var e=this.$("#headline")[0].selectionStart,t=this.$("#headline").val();return this.$("#headline").val(t.substring(0,e)+"\u201d"+t.substring(e)),this.onHeadline(),!1},onSingleOpenQuote:function(){var e=this.$("#headline")[0].selectionStart,t=this.$("#headline")[0].selectionEnd,n=this.$("#headline").val();return t>e&&(this.$("#headline").val(n.substring(0,t)+"\u2019"+n.substring(t)),n=this.$("#headline").val()),this.$("#headline").val(n.substring(0,e)+"\u2018"+n.substring(e)),this.onHeadline(),!1},onSingleCloseQuote:function(){var e=this.$("#headline")[0].selectionStart,t=this.$("#headline").val();return this.$("#headline").val(t.substring(0,e)+"\u2019"+t.substring(e)),this.onHeadline(),!1},onEmdash:function(){var e=this.$("#headline")[0].selectionStart,t=this.$("#headline").val();return this.$("#headline").val(t.substring(0,e)+"\u2014"+t.substring(e)),this.onHeadline(),!1},onName:function(){this.model.set("nameText",this.$("#name").val())},onCredit:function(){this.model.set("creditText",this.$("#credit").val())},onHeadline:function(){this.model.set("headlineText",this.$("#headline").val())},onTextAlign:function(){this.model.set("textAlign",this.$("#text-align").val())},onTextShadow:function(){this.model.set("textShadow",this.$("#text-shadow").prop("checked"))},onFontSize:function(){this.model.set("fontSize",this.$("#font-size").val())},onFontFamily:function(){this.model.set("fontFamily",this.$("#font-family").val())},onTheme:function(){this.model.set("theme",this.$("#theme").val())},onWatermark:function(){this.model.set("watermarkSrc",this.$("#watermark").val()),localStorage&&localStorage.setItem("meme_watermark",this.$("#watermark").val())},onScale:function(){this.model.set("imageScale",this.$("#image-scale").val())},onOverlayColor:function(e){this.model.set("overlayColor",this.$(e.target).val())},onBackgroundColor:function(e){this.model.set("backgroundColor",this.$(e.target).val())},getDataTransfer:function(e){return e.stopPropagation(),e.preventDefault(),e.originalEvent.dataTransfer||null},onZoneOver:function(e){var t=this.getDataTransfer(e);t&&(t.dropEffect="copy",this.$("#dropzone").addClass("pulse"))},onZoneOut:function(){this.$("#dropzone").removeClass("pulse")},onZoneDrop:function(e){var t=this.getDataTransfer(e);t&&(this.model.loadBackground(t.files[0]),this.$("#dropzone").removeClass("pulse"))}});