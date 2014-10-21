/*
* MemeCanvasView
* Manages the creation, rendering, and download of the Meme image.
*/
var headlineBase = 0;
var nameBase = 0;

MEME.MemeCanvasView = Backbone.View.extend({

  initialize: function() {
    var canvas = document.createElement('canvas');
    var $container = MEME.$('#meme-canvas');

    // Display canvas, if enabled:
    if (canvas && canvas.getContext) {
      $container.html(canvas);
      this.canvas = canvas;
      this.setDownload();
      this.render();
    } else {
      $container.html(this.$('noscript').html());
    }

    // Listen to model for changes, and re-render in response:
    this.listenTo(this.model, 'change', this.render);
  },

  setDownload: function() {
    var a = document.createElement('a');
    if (typeof a.download == 'undefined') {
      this.$el.append('<p class="m-canvas__download-note">Right-click button and select "Download Linked File..." to save image.</p>');
    }
  },

  render: function() {
    // Return early if there is no valid canvas to render:
    if (!this.canvas) return;

    // Collect model data:
    var m = this.model;
    var d = this.model.toJSON();
    var ctx = this.canvas.getContext('2d');
    var padding = Math.round(d.width * d.paddingRatio);

    // Reset canvas display:
    this.canvas.width = d.width;
    this.canvas.height = d.height;
    ctx.clearRect(0, 0, d.width, d.height);

    function renderBackground(ctx) {
      // Base height and width:
      var bh = m.background.height;
      var bw = m.background.width;

      if (bh && bw) {
        // Transformed height and width:
        // Set the base position if null
        var th = bh * d.imageScale;
        var tw = bw * d.imageScale;
        var cx = d.backgroundPosition.x || d.width / 2;
        var cy = d.backgroundPosition.y || d.height / 2;

        ctx.drawImage(m.background, 0, 0, bw, bh, cx-(tw/2), cy-(th/2), tw, th);
      }
    }

    function renderBackgroundColor(ctx) {
      if (d.overlayColor) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = d.themeData[d.theme].background;
        ctx.fillRect(0, 0, d.width, d.height);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    function renderOverlay(ctx) {
      if (d.overlayColor) {
        ctx.save();
        ctx.globalAlpha = d.overlayAlpha;
        ctx.fillStyle = d.overlayColor;
        ctx.fillRect(0, 0, d.width, d.height);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    function renderHeadline(ctx) {
      var maxWidth = Math.round(d.width * 0.6);
      var x = padding+20;
      var y = padding+6;

      ctx.font = d.fontSize +'pt '+ d.themeData[d.theme].headlineFont;
      ctx.fillStyle = d.themeData[d.theme].headline;
      ctx.textBaseline = 'top';

      // Text shadow:
      if (d.textShadow) {
        ctx.shadowColor = "#666";
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 10;
      }

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
        y = d.height - d.height / 1.3;
        maxWidth = d.width - d.width / 3;

      } else if (d.textAlign == 'right' ) {
        ctx.textAlign = 'left';
        x = (d.width / 2) - (padding*2);
      } else {
        ctx.textAlign = 'left';
      }

      var lines = d.headlineText.split("\n");
      for (var m = 0; m < lines.length; m++) {
        var words = lines[m].split(' ');
        var line  = '';

        if(m > 0) {
          y += Math.round(d.fontSize * 1.55);
        }

        for (var n = 0; n < words.length; n++) {
          var testLine  = line + words[n] + ' ';
          var metrics   = ctx.measureText( testLine );
          var testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y-10);
            line = words[n] + ' ';
            y += Math.round(d.fontSize * 1.55);
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y-10);
      }
      ctx.shadowColor = 'transparent';
      headlineBase = y+Math.round(d.fontSize * 1.55)-10;
    }

    function renderWatermark(ctx) {
      // Base & transformed height and width:
      var bw, bh, tw, th;
      bh = th = m.watermark.height;
      bw = tw = m.watermark.width;

      if (bh && bw) {
        // Calculate watermark maximum width:
        var mw = d.width * d.watermarkMaxWidthRatio;

        // Constrain transformed height based on maximum allowed width:
        if (mw < bw) {
          th = bh * (mw / bw);
          tw = mw;
        }

        ctx.globalAlpha = d.watermarkAlpha;
        ctx.drawImage(m.watermark, 0, 0, bw, bh, 20, d.height-20-th, tw, th);
        ctx.globalAlpha = 1;
      }
    }

    function renderQuotemark(ctx) {
      if (d.textAlign == 'left') {
        ctx.textAlign = 'left';
        ctx.fillStyle = d.themeData[d.theme].quote;

        switch(d.themeData[d.theme].headlineFont) {
          case '"SundayTimesModern-Medium"':
          case 'SundayTimesModern-Medium':
            switch(d.fontSize) {
              case '28':
                var x = padding-24;
                var y = padding-26;
                break;
              default:
                var x = padding-16;
                var y = padding-21;
                break;
            }
            ctx.font = 'normal '+ (d.fontSize*2.7) +'pt '+ d.themeData[d.theme].headlineFont;
            break;
          case '"TimesModernCondensed-Bold"':
          case 'TimesModernCondensed-Bold':
            switch(d.fontSize) {
              case '28':
                var x = padding-10;
                var y = padding-2;
                break;
              default:
                var x = padding-8;
                var y = padding-5;
                break;
            }
            ctx.font = 'normal '+ (d.fontSize*2.7) +'pt '+ d.themeData[d.theme].headlineFont;
            break;
          case '"TimesModernCondensed-Regular"':
          case 'TimesModernCondensed-Regular':
            switch(d.fontSize) {
              case '28':
                var x = padding-10;
                var y = padding-2;
                break;
              default:
                var x = padding-8;
                var y = padding-5;
                break;
            }
            ctx.font = 'normal '+ (d.fontSize*3.1) +'pt '+ d.themeData[d.theme].headlineFont;
            break;
          default:
            switch(d.fontSize) {
              case '28':
                var x = padding-10;
                break;
              default:
                var x = padding-4;
                break;
            }
            var y = padding-10;
            ctx.font = 'normal '+ (d.fontSize*2.9) +'pt '+ d.themeData[d.theme].headlineFont;
            break;
        }
        ctx.fillText(d.quotemarkText, x, y);
      }
    }

    function renderName(ctx) {
      ctx.fillStyle = d.themeData[d.theme].name;
      ctx.font = 'normal '+ Math.round(d.fontSize*0.9) +'pt '+ d.themeData[d.theme].nameFont;
      nameBase = headlineBase + Math.round(d.nameSize * 2.2);

      var x = padding+20;
      var y = headlineBase+4;

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
      } else if (d.textAlign == 'right' ) {
        ctx.textAlign = 'left';
        x = (d.width / 2) - (padding*2);
      } else {
        ctx.textAlign = 'left';
      }

      ctx.fillText(d.nameText, x, y);
    }

    function renderCredit(ctx) {
      ctx.fillStyle = d.themeData[d.theme].credit;
      ctx.font = 'normal '+ d.creditSize +'pt '+ d.themeData[d.theme].font;
      
      var x = padding+20;
      var y = nameBase+4;

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
      } else if (d.textAlign == 'right' ) {
        ctx.textAlign = 'left';
        x = (d.width / 2) - (padding*2);
      } else {
        ctx.textAlign = 'left';
      }

      ctx.fillText(d.creditText, x, y);
    }

    renderBackgroundColor(ctx);
    renderBackground(ctx);
    //renderOverlay(ctx);
    renderHeadline(ctx);
    //renderCredit(ctx);
    renderWatermark(ctx);
    renderQuotemark(ctx);
    renderName(ctx);
    renderCredit(ctx);

    var data = this.canvas.toDataURL(); //.replace('image/png', 'image/octet-stream');
    this.$('#meme-download').attr({
      'href': data,
      'download': (d.downloadName || 'share') + '.png'
    });

    // Enable drag cursor while canvas has artwork:
    this.canvas.style.cursor = this.model.background.width ? 'move' : 'default';
  },

  events: {
    'mousedown canvas': 'onDrag'
  },

  // Performs drag-and-drop on the background image placement:
  onDrag: function(evt) {
    evt.preventDefault();

    // Return early if there is no background image:
    if (!this.model.hasBackground()) return;

    // Configure drag settings:
    var model = this.model;
    var d = model.toJSON();
    var iw = model.background.width * d.imageScale / 2;
    var ih = model.background.height * d.imageScale / 2;
    var origin = {x: evt.clientX, y: evt.clientY};
    var start = d.backgroundPosition;
    start.x = start.x || d.width / 2;
    start.y = start.y || d.height / 2;

    // Create update function with draggable constraints:
    function update(evt) {
      evt.preventDefault();
      

      /**model.set('backgroundPosition', {
        x: Math.max(d.width-iw, Math.min(start.x - (origin.x - evt.clientX), iw)),
        y: Math.max(d.height-ih, Math.min(start.y - (origin.y - evt.clientY), ih))
      });
      **/
      model.set('backgroundPosition', {
        x: start.x - (origin.x - evt.clientX),
        y: start.y - (origin.y - evt.clientY)
      });
    }

    // Perform drag sequence:
    var $doc = MEME.$(document)
      .on('mousemove.drag', update)
      .on('mouseup.drag', function(evt) {
        $doc.off('mouseup.drag mousemove.drag');
        update(evt);
      });
  }
});
