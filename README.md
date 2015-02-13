# motion-slider

# Mobile touch and responsive slider with hardware accelerated transitions

## About

'Motion slider' work with hardware accelerated transitions (where supported) and amazing native behavior. It will be use website ( responsive, non-responsive), and mobile native apps.

## Features

  * **Horizontal**. 'Motion slider' comes with Horizontal animation

  * **Rotation/resize adjustment**. 'Motion slider' will be reinitialized after rotation of device

  * **Responsive**. Auto adjust width device resolutions

  * **Built-in pagination control**. Can be disabled/enable

  * **Auto Play**. Just set the delay and slider will change the slides automatically untill you touch/navigation it.

  * **Loop mode**. In this mode you will get infinite scrolling and first slides will repeat after last ones. New in 1.5

  * **Any HTML**. You can put any HTML content inside of slide, not only images

  * **Rich API**. 'Motion slider' comes with very rich API. It allows to create your own pagination, "next" and "previous" buttons 

  * **Flexible configuration**. 'Motion slider' accepts a various parameters on initialization to make it much flexible as possible. You can configure animation speed, enable/disable pagination, touch ratio, etc.

  * **Hardware accelerated**. 'Motion slider' uses hardware accelerated technics (where supported) to achive ultra smooth animation and perfomance, especially on iOS devices.

  * **Awesome compatibility**. 'Motion slider' compatible and tested with: Mobile Safari (tested on iOS5), Android 2.1+, latest desktop versions of Google Chrome, Safari, Firefox, Internet Explorer 7+ and Opera.
  
## How to Use 

  * **Include required files** 
  <script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/jquery.js">\x3C/script>')</script>
  <script type="text/javascript" src="js/jquery.mobile-events.min.js"></script>
  <script type="text/javascript" src="js/motion-slider-min-1.0.0.js"></script>
  
  * **HTML markup**
  <div id="slideshow">
    <ul class="slider-listing">
        <li>...</li>
        <li>...</li>
    </ul>
  </div>
  
  Replace your custom slideshow ID and this will be same in jquery function and css. In giving ex. current ID is "slideshow".
  
  jQuery(document).ready(function($) {
	$('#slideshow').msr({
		keyboardnav     : true  // Configuration goes here
	});
  });
  
  * **Style for Slider required**
  
  #slideshow ul.slider-listing { overflow: hidden; list-style: none; position: relative; }
  
  * **Configuration Setting**

	* width           : 800,      // Integer: initial width of slider
	* height          : 300,      // Integer: initial height of slider
	* animtype        : 'slide',  // String: Select your animation type, "fade" or "slide"
	* animduration    : 450,      // Integer: Set the speed of animations, in milliseconds
	* animspeed       : 4000,     // Integer: Set the speed of the slideshow cycling, in milliseconds
	* automatic       : true,     // Boolean: enable/disable automatic slide rotation
	* showcontrols    : true,     // Boolean: enable/disable next + previous UI elements
	* centercontrols  : true,     // Boolean: vertically center controls
	* nexttext        : 'Next',   // String: Set the text for the "previous" directionNav item
	* prevtext        : 'Prev',   // String: Set the text for the "next" directionNav item
	* showmarkers     : true,     // Boolean: enable/disable individual slide UI markers
	* centermarkers   : true,     // Boolean: horizontally center markers
	* keyboardnav     : true,     // Boolean: Allow slider navigating via keyboard left/right keys
	* hoverpause      : true,     // Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
	* touch           : true,     // Boolean: touch event for mobile
	* usecaptions     : true,     // Boolean: enable/disable captions using img title attribute
	* randomstart     : false,    // Boolean: start from a random slide
	* responsive      : true,     // Boolean: enable responsive behaviour
	* backwardSlide   : false     // Boolean: enable to reverse slider