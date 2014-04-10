// UI controls
var clock = $('#clock');
var disableClok = $('#disableClock');
var FONT = '18px Helvetica';
var FONT_HEIGHT = 18;
var CANVAS_HEIGHT = 24;
var canvas = document.querySelector('canvas');
canvas.height = CANVAS_HEIGHT;
var ctx = canvas.getContext('2d');
ctx.font = FONT;

var textImage = null;
var textImageOverlay = null;

// resources
var timer = null;

function addHangoutsClock() {
  // add behavior to UI Controls
  clock.click(enableClock);
  disableClok.click(disableClock);
}

function enableClock() {
  timer = setInterval(refresh,1000);
  clock.hide();
  disableClok.show();
}

function disableClock() {
  // Disable and release background replacement.
  clearInterval(timer);
  textImageOverlay.setVisible(false);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if( textImageOverlay && textImageOverlay.isDisposed() === false ) {
    textImageOverlay.dispose();
  }
  if( textImage && textImage.isDisposed() === false ) {
    textImage.dispose();
  }
  clock.show();
  disableClok.hide();
}

function refresh() {
  var text = moment().format();
  canvas.width  = ctx.measureText(text).width;
  ctx.font = FONT;

  /// background color
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /// text color
  ctx.fillStyle = '#000';
  ctx.fillText(text, 0, FONT_HEIGHT);

  if( textImageOverlay && textImageOverlay.isDisposed() === false ) {
    textImageOverlay.dispose();
  }
  // if( textImage && textImage.isDisposed() === false ) {
  //   textImage.dispose();
  // }

  textImage = gapi.hangout.av.effects.createImageResource(canvas.toDataURL());
  textImageOverlay = textImage.createOverlay(
    {'scale':
      {'magnitude': canvas.width/gapi.hangout.layout.getVideoCanvas().getWidth(),
       'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
  // Place the text x-centered
  textImageOverlay.setPosition(0, 0.45);
  textImageOverlay.setVisible(true);
}

// Kicks off app and attaches all listeners.
function startApp() {
 addHangoutsClock();
}


function init() {
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        startApp();
      });
}

// Add API listener immediately.  If you need an
// OAuth 2.0 access token, your startup will need to
// be different.
init();
