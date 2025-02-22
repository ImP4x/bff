var book = $('.bk-book');
var bookPage = book.children('div.bk-page');
var viewBookLink = book.find('.bk-title'); // Seleccionamos el div con clase bk-title

var bookDefault = function(){
  book.data({ opened : false, flip : false })
      .removeClass('bk-viewback bk-viewinside')
      .addClass('bk-bookdefault');
};
var bookBack = function(){
  book.data({ opened : false, flip : true })
      .removeClass('bk-viewinside bk-bookdefault')
      .addClass('bk-viewback');
};
var bookInside = function(){
  book.data({ opened : true, flip : false })
      .removeClass('bk-viewback bk-bookdefault')
      .addClass( 'bk-viewinside');
};

bookDefault();

function PlayAudio() {
  var audio = document.getElementById("fnd");
  if (audio.paused) { // Verificar si el audio está pausado
    audio.volume = 1;
    audio.play();
  }
}

//Detect click outside book
$('html').on( 'click', function(event) {
  if ($(event.target).parents('.bk-book').length == 0){
    bookDefault();
  }
  return false;
});

//Bookblock clone and setup
var bookBlock = $('.bb-bookblock');
var backCover = bookBlock.parents('.bk-book').find('.bk-cover-back');
var backCoverBookBlock = bookBlock.clone();
backCoverBookBlock.appendTo(backCover);

var bookBlockFirst = function(){
  bookBlock.bookblock('first');
  backCoverBookBlock.bookblock('first');
}
var bookBlockLast = function(){
  bookBlock.bookblock('last');
  backCoverBookBlock.bookblock('last');
}

var bookBlockLastIndex = bookBlock.children().length - 1;
var bookBlockNext = function(){
  if (book.data('flip'))
    return bookDefault();
  if(!book.data('opened'))
    return bookInside();
  if (bookBlock.find('.bb-item:visible').index() === bookBlockLastIndex) {
    // Regresar a la portada al llegar al final
    bookDefault();
    bookBlockFirst();
    return;
  }
  bookBlock.bookblock('next');
  backCoverBookBlock.bookblock('next');
}
var bookBlockPrev = function(){
  if (book.data('flip'))
    return bookBlockLast() + bookInside();
  if(!book.data('opened'))
    return bookBack();
  if (bookBlock.find('.bb-item:visible').index() === 0)
    return bookDefault();
  bookBlock.bookblock('prev');
  backCoverBookBlock.bookblock('prev');
}

bookBlock.children().add(backCoverBookBlock.children()).on({
  'swipeleft': function(event) {
    bookBlockPrev();
    return false;
  },
  'swiperight': function(event) {
    bookBlockPrev();
    return false;
  },
  'click': function(event){
    if ($(event.target).parents('.bk-cover-back').length == 0)
      bookBlockNext();
    else
      bookBlockPrev();
    return false;
  }
});

bookBlock.bookblock({
  speed: 800,
  shadow: false
});
backCoverBookBlock.bookblock({
  speed: 800,
  shadow: false
});

var throttleFunc = function(func, limit, limitQueue){
  var lastTime = + new Date;
  var queued = 0;
  return function throttledFunc(){
    var now = + new Date;
    var args = Array.prototype.slice.call(arguments);
    if (now - lastTime > limit){
      func.apply(this, args);
      lastTime = + new Date;
    }else{
      var boundFunc = throttledFunc.bind.apply(throttledFunc, [this].concat(args));
      queued++;
      if (queued < limitQueue)
        window.setTimeout(boundFunc, lastTime + limit - now);
    }
  }
}

$(document).keydown(throttleFunc(function(e) {
  var keyCode = e.keyCode || e.which,
    arrow = {
      left : 37,
      up : 38,
      right : 39,
      down : 40
    };

  switch (keyCode) {
    case arrow.left:
      bookBlockPrev();
      break;
    case arrow.right:
      bookBlockNext();
      break;
  }
}, 500, 2));

// Mover la funcionalidad del botón "Open me" al div con clase bk-title
viewBookLink.on('click', function(){
  bookInside();
  return false;
});

var canvas;
var context;
var screenH;
var screenW;
var stars = [];
var fps = 50;
var numStars = 2000;

$('document').ready(function() {
  
  // Calculate the screen size
	screenH = $(window).height();
	screenW = $(window).width();
	
	// Get the canvas
	canvas = $('#space');
	
	// Fill out the canvas
	canvas.attr('height', screenH);
	canvas.attr('width', screenW);
	context = canvas[0].getContext('2d');
	
	// Create all the stars
	for(var i = 0; i < numStars; i++) {
		var x = Math.round(Math.random() * screenW);
		var y = Math.round(Math.random() * screenH);
		var length = 1 + Math.random() * 2;
		var opacity = Math.random();
		
		// Create a new star and draw
		var star = new Star(x, y, length, opacity);
		
		// Add the the stars array
		stars.push(star);
	}
	
	setInterval(animate, 1000 / fps);
});

/**
 * Animate the canvas
 */
function animate() {
	context.clearRect(0, 0, screenW, screenH);
	$.each(stars, function() {
		this.draw(context);
	})
}

/**
 * Star
 * 
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
function Star(x, y, length, opacity) {
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.length = parseInt(length);
	this.opacity = opacity;
	this.factor = 1;
	this.increment = Math.random() * .03;
}

/**
 * Draw a star
 * 
 * This function draws a start.
 * You need to give the contaxt as a parameter 
 * 
 * @param context
 */
Star.prototype.draw = function() {
	context.rotate((Math.PI * 1 / 10));
	
	// Save the context
	context.save();
	
	// move into the middle of the canvas, just to make room
	context.translate(this.x, this.y);
	
	// Change the opacity
	if(this.opacity > 1) {
		this.factor = -1;
	}
	else if(this.opacity <= 0) {
		this.factor = 1;
		
		this.x = Math.round(Math.random() * screenW);
		this.y = Math.round(Math.random() * screenH);
	}
		
	this.opacity += this.increment * this.factor;
	
	context.beginPath()
	for (var i = 5; i--;) {
		context.lineTo(0, this.length);
		context.translate(0, this.length);
		context.rotate((Math.PI * 2 / 10));
		context.lineTo(0, - this.length);
		context.translate(0, - this.length);
		context.rotate(-(Math.PI * 6 / 10));
	}
	context.lineTo(0, this.length);
	context.closePath();
	context.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
	context.shadowBlur = 5;
	context.shadowColor = '#ffff33';
	context.fill();
	
	context.restore();
}