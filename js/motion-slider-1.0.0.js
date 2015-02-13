;(function($) { 

    "use strict";

    $.fn.msr = function(e) {
        
        // slider default settings
        var defaults        = {

            // w + h to enforce consistency
            width           : 800,      // Integer: initial width of slider
            height          : 300,      // Integer: initial height of slider

            // transition valuess
            animtype        : 'slide',  // String: Select your animation type, "fade" or "slide"
            animduration    : 450,      // Integer: Set the speed of animations, in milliseconds
            animspeed       : 4000,     // Integer: Set the speed of the slideshow cycling, in milliseconds
            automatic       : true,     // Boolean: enable/disable automatic slide rotation

            // control and marker configuration
            showcontrols    : true,     // Boolean: enable/disable next + previous UI elements
            centercontrols  : true,     // Boolean: vertically center controls
            nexttext        : 'Next',   // String: Set the text for the "previous" directionNav item
            prevtext        : 'Prev',   // String: Set the text for the "next" directionNav item
            showmarkers     : true,     // Boolean: enable/disable individual slide UI markers
            centermarkers   : true,     // Boolean: horizontally center markers

            // interaction values
            keyboardnav     : true,     // Boolean: Allow slider navigating via keyboard left/right keys
            hoverpause      : true,     // Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
			touch           : true,     // Boolean: touch event for mobile

            // presentational options
            usecaptions     : true,     // Boolean: enable/disable captions using img title attribute
            randomstart     : false,    // Boolean: start from a random slide
            responsive      : true,     // Boolean: enable responsive behaviour
			backwardSlide   : false     // Boolean: enable to reverse slider
        };

        // create settings from defauls and user options
        var settings        = $.extend({}, defaults, e);

        // slider elements
        var $wrapper        = this,
            $slider         = $wrapper.find('ul.slider-listing'),
            $slides         = $slider.children('li'),

            // control elements
            $c_wrapper      = null,
            $c_fwd          = null,
            $c_prev         = null,

            // marker elements
            $m_wrapper      = null,
            $m_markers      = null,

            // elements for slide animation
            $canvas         = null,
            $clone_first    = null,
            $clone_last     = null;
			
        // state management object
        var state           = {
            slidecount      : $slides.length,   // total number of slides
            animating       : false,            // bool: is transition is progress
            paused          : false,            // bool: is the slider paused
            currentslide    : 1,                // current slide being viewed (not 0 based)
            nextslide       : 0,                // slide to view next (not 0 based)
            currentindex    : 0,                // current slide being viewed (0 based)
            nextindex       : 0,                // slide to view next (0 based)
            interval        : null              // interval for automatic rotation
        };

        var responsive      = {
            width           : null,
            height          : null,
            ratio           : null
        };

        var backwardSlide      = {
			reverseSlider   : false
        };

        // helpful variables
        var vars            = {
            fwd             : 'forward',
            prev            : 'previous'
        };
            
        // run through options and initialise settings
        var init = function() {

            // differentiate slider li from content li
            $slides.addClass('msr-slide');

            // conf dimensions, responsive or static
            if( settings.responsive ){
                msr_responsive();
            }
            else{
                msr_static();
            }

            // configurations only avaliable if more than 1 slide
            if( state.slidecount > 1 ){
				
                // enable Reverse slider
              /* if( settings.backwardSlide ){
                    msr_reverse();
                }*/

                // enable random start
                if (settings.randomstart){
                    msr_random();
                }

                // create and show controls
                if( settings.showcontrols ){
                    msr_controls();
                }

                // create and show markers
                if( settings.showmarkers ){
                    msr_markers();
                }

                // enable slidenumboard navigation
                if( settings.keyboardnav ){
                    msr_keynav();
                }

                // enable touch navigation
                if( settings.touch ){
                    msr_touch();
                }

                // enable pause on hover
                if (settings.hoverpause && settings.automatic){
                    msr_hoverpause();
                }

                // conf slide animation
                if (settings.animtype === 'slide'){
                    msr_slide();
                }
				
            } else {
                // Stop automatic animation, because we only have one slide! 
                settings.automatic = false;
            }

            if(settings.usecaptions){
                msr_captions();
            }

            // TODO: need to accomodate random start for slide transition setting
            if(settings.animtype === 'slide' && !settings.randomstart){
                state.currentindex = 1;
                state.currentslide = 2;
            }

            // slide components are hidden by default, show them now
            $slider.show();
            $slides.eq(state.currentindex).show();

            // Finally, if automatic is set to true, kick off the interval
            if(settings.automatic){
                state.interval = setInterval(function () {
					if(settings.backwardSlide){
						go(vars.prev, false);
					}
					else {
						go(vars.fwd, false);
					}
                }, settings.animspeed);
            }

        };

        var msr_responsive = function() {

            responsive.width    = $wrapper.outerWidth();
            responsive.ratio    = responsive.width/settings.width;
            responsive.height   = settings.height * responsive.ratio;

            if(settings.animtype === 'fade'){

                // initial setup
                $slides.css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $slides.children('img').css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $slider.css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $wrapper.css({
                    'height'        : settings.height,
                    'max-width'     : settings.width,
                    'position'      : 'relative'
                });

                if(responsive.width < settings.width){

                    $slides.css({
                        'height'        : responsive.height
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height
                    });
                    $slider.css({
                        'height'        : responsive.height
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                }

                $(window).resize(function() {

                    // calculate and update dimensions
                    responsive.width    = $wrapper.outerWidth();
                    responsive.ratio    = responsive.width/settings.width;
                    responsive.height   = settings.height * responsive.ratio;

                    $slides.css({
                        'height'        : responsive.height
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height
                    });
                    $slider.css({
                        'height'        : responsive.height
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                });

            }

            if(settings.animtype === 'slide'){

                // initial setup
                $slides.css({
                    'height'        : settings.height,
                    'width'         : settings.width
                });
                $slides.children('img').css({
                    'height'        : settings.height,
                    'width'         : settings.width
                });
                $slider.css({
                    'height'        : settings.height,
                    'width'         : settings.width * state.slidecount
                });
                $wrapper.css({
                    'height'        : settings.height,
                    'max-width'     : settings.width,
                    'position'      : 'relative'
                });

                if(responsive.width < settings.width){
					
                    $slides.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slider.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width * (state.slidecount + 2)
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                }

                $(window).resize(function() {

                    // calculate and update dimensions
                    responsive.width    = $wrapper.outerWidth();
                    responsive.ratio    = responsive.width/settings.width;
                    responsive.height   = settings.height * responsive.ratio;

                    $slides.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slider.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width * (state.slidecount + 2)
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });
                    $canvas.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });

                    resize_complete(function(){
                        go(false,state.currentslide);
                    }, 200, "some unique string");

                });

            }

        };

        var resize_complete = (function () {
            
            var timers = {};
            
            return function (callback, ms, uniqueId) {
                if (!uniqueId) {
                    uniqueId = "Don't call this twice without a uniqueId";
                }
                if (timers[uniqueId]) {
                    clearTimeout (timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };

        })();

        // enforce fixed sizing on slides, slider and wrapper
        var msr_static = function() {

            $slides.css({
                'height'    : settings.height,
                'width'     : settings.width
            });
            $slider.css({
                'height'    : settings.height,
                'width'     : settings.width
            });
            $wrapper.css({
                'height'    : settings.height,
                'width'     : settings.width,
                'position'  : 'relative'
            });

        };

        var msr_slide = function() {

            // create two extra elements which are clones of the first and last slides
            $clone_first    = $slides.eq(0).clone();
            $clone_last     = $slides.eq(state.slidecount-1).clone();

            // add them to the DOM where we need them
            $clone_first.attr({'data-clone' : 'last', 'data-slide' : 0}).appendTo($slider).show();
            $clone_last.attr({'data-clone' : 'first', 'data-slide' : 0}).prependTo($slider).show();

            // update the elements object
            $slides             = $slider.children('li');
            state.slidecount    = $slides.length;

            // create a 'canvas' element which is neccessary for the slide animation to work
            $canvas = $('<div class="msr-wrapper"></div>');

            // if the slider is responsive && the calculated width is less than the max width
            if(settings.responsive && (responsive.width < settings.width)){

                $canvas.css({
                    'width'     : responsive.width,
                    'height'    : responsive.height,
                    'overflow'  : 'hidden',
                    'position'  : 'relative'
                });

                // update the dimensions to the slider to accomodate all the slides side by side
                $slider.css({
                    'width'     : responsive.width * (state.slidecount + 2),
                    'left'      : -responsive.width * state.currentslide
                });

            }
            else {

                $canvas.css({
                    'width'     : settings.width,
                    'height'    : settings.height,
                    'overflow'  : 'hidden',
                    'position'  : 'relative'
                });

                // update the dimensions to the slider to accomodate all the slides side by side
                $slider.css({
                    'width'     : settings.width * (state.slidecount + 2),
                    'left'      : -settings.width * state.currentslide
                });

            }

            // add some inline styles which will align our slides for left-right sliding
            $slides.css({
                'float'         : 'left',
                'position'      : 'relative',
                'display'       : 'list-item'
            });

            // 'everything.. in it's right place'
            $canvas.prependTo($wrapper);
            $slider.appendTo($canvas);

        };

        var msr_controls = function() {

            // create the elements for the controls
            $c_wrapper  = $('<ul class="msr-controls"></ul>');
            $c_fwd      = $('<li class="msr-next"><a href="#" data-direction="'+ vars.fwd +'">' + settings.nexttext + '</a></li>');
            $c_prev     = $('<li class="msr-prev"><a href="#" data-direction="'+ vars.prev +'">' + settings.prevtext + '</a></li>');

            // bind click events
            $c_wrapper.on('click','a',function(e){

                e.preventDefault();
                var direction = $(this).attr('data-direction');

                if(!state.animating){
					
					if(settings.backwardSlide){
						if(direction === vars.fwd){
							go(vars.prev,false);
						}
	
						if(direction === vars.prev){
							go(vars.fwd,false);
						}
					}
					else {
						if(direction === vars.fwd){
							go(vars.fwd,false);
						}
	
						if(direction === vars.prev){
							go(vars.prev,false);
						}
					}


                }

            });

            // put 'em all together
            $c_prev.appendTo($c_wrapper);
            $c_fwd.appendTo($c_wrapper);
            $c_wrapper.appendTo($wrapper);

            // vertically center the controls
            if (settings.centercontrols) {

                $c_wrapper.addClass('v-centered');

                // calculate offset % for vertical positioning
                var offset_px   = ($wrapper.height() - $c_fwd.children('a').outerHeight()) / 2,
                    ratio       = (offset_px / settings.height) * 100,
                    offset      = ratio + '%';

                $c_fwd.find('a').css('top', offset);
                $c_prev.find('a').css('top', offset);

            }

        };

        var msr_markers = function() {
			
            // create a wrapper for our markers
            $m_wrapper = $('<ol class="mrs-markers"></ol>');

            // for every slide, create a marker
            $.each($slides, function(key, slide){
				
                var slidenum    = key + 1,
                    gotoslide   = key + 1;
                
                if(settings.animtype === 'slide'){
                    // + 2 to account for clones
                    gotoslide = key + 2;
                }

                var marker = $('<li><a href="#">'+ slidenum +'</a></li>');

                // set the first marker to be active
                if(slidenum === state.currentslide){ marker.addClass('active-marker'); }

                // bind the click event
                marker.on('click','a',function(e){
                    e.preventDefault();
                    if(!state.animating && state.currentslide !== gotoslide){
                        go(false,gotoslide);
                    }
                });

                // add the marker to the wrapper
                marker.appendTo($m_wrapper);

            });

            $m_wrapper.appendTo($wrapper);
            $m_markers = $m_wrapper.find('li');

            // center the markers
            if (settings.centermarkers) {
                $m_wrapper.addClass('h-centered');
                var offset = (settings.width - $m_wrapper.width()) / 2;
                $m_wrapper.css('left', offset);
            }

        };

        var msr_keynav = function() {

            $(document).keyup(function (event) {

                if (!state.paused) {
                    clearInterval(state.interval);
                    state.paused = true;
                }

                if (!state.animating) {
					
					if(settings.backwardSlide){
						if (event.keyCode === 39) {
							event.preventDefault();
							go(vars.prev, false);
						} else if (event.keyCode === 37) {
							event.preventDefault();
							go(vars.fwd, false);
						}
						
					}
					else {
					
						if (event.keyCode === 39) {
							event.preventDefault();
							go(vars.fwd, false);
						} else if (event.keyCode === 37) {
							event.preventDefault();
							go(vars.prev, false);
						}
					
					}
                }

                if (state.paused && settings.automatic) {
                    state.interval = setInterval(function () {
						if(settings.backwardSlide){
							 go(vars.prev);
						}
						else {
							 go(vars.fwd);
						}
                    }, settings.animspeed);
                    state.paused = false;
                }

            });

        };

        var msr_touch = function() {

            $($slider).on('swipe',function (event) {

                if (!state.paused) {
                    clearInterval(state.interval);
                    state.paused = true;
                }

                if (!state.animating) {
					if(settings.backwardSlide){
						$($slider).on('swipeleft',function (event) {
							event.preventDefault();
							go(vars.prev, false);
						}); 
						$($slider).on('swiperight',function (event) {
							event.preventDefault();
							go(vars.fwd, false);
						});
					}
					else {
						$($slider).on('swipeleft',function (event) {
							event.preventDefault();
							go(vars.fwd, false);
						}); 
						$($slider).on('swiperight',function (event) {
							event.preventDefault();
							go(vars.prev, false);
						});
					}
                }

                if (state.paused && settings.automatic) {
                    state.interval = setInterval(function () {
						if(settings.backwardSlide){
							go(vars.prev);
						}
						else {
							go(vars.fwd);	
						}
                    }, settings.animspeed);
                    state.paused = false;
                }

            });

        };

        var msr_hoverpause = function() {

            $wrapper.hover(function () {
                if (!state.paused) {
                    clearInterval(state.interval);
                    state.paused = true;
                }
            }, function () {
                if (state.paused) {
                    state.interval = setInterval(function () {
						if(settings.backwardSlide){
							go(vars.prev, false);
						}
						else {
							go(vars.fwd, false);
						}
                    }, settings.animspeed);
                    state.paused = false;
                }
            });

        };
		
		/*var msr_reverse = function() {
			
			state.currentslide = state.slidecount;
		
		};*/

        var msr_captions = function() {

            $.each($slides, function (key, slide) {

                var caption = $(slide).children('img:first-child').attr('title');

                // Account for images wrapped in links
                if(!caption){
                    caption = $(slide).children('a').find('img:first-child').attr('title');
                }

                if (caption) {
                    caption = $('<p class="msr-caption">' + caption + '</p>');
                    caption.appendTo($(slide));
                }

            });

        };

        var msr_random = function() {

            var rand            = Math.floor(Math.random() * state.slidecount) + 1;
            state.currentslide  = rand;
            state.currentindex  = rand-1;

        };

        var set_next = function(direction) {
			
			if(settings.backwardSlide){

				if(direction === vars.fwd){
					
					if($slides.eq(state.currentindex).prev().length){
						state.nextindex = state.currentindex - 1;
						state.nextslide = state.currentslide - 1;
					}
					else{
						state.nextindex = state.slidecount - 1;
						state.nextslide = state.slidecount;
					}
	
				}
				else{
					
					if($slides.eq(state.currentindex).next().length){
						state.nextindex = state.currentindex + 1;
						state.nextslide = state.currentslide + 1;
					}
					else{
						state.nextindex = 0;
						state.nextslide = 1;
					}
	
				}
				
			}
			else {

				if(direction === vars.fwd){
					
					if($slides.eq(state.currentindex).next().length){
						state.nextindex = state.currentindex + 1;
						state.nextslide = state.currentslide + 1;
					}
					else{
						state.nextindex = 0;
						state.nextslide = 1;
					}
	
				}
				else{
	
					if($slides.eq(state.currentindex).prev().length){
						state.nextindex = state.currentindex - 1;
						state.nextslide = state.currentslide - 1;
					}
					else{
						state.nextindex = state.slidecount - 1;
						state.nextslide = state.slidecount;
					}
	
				}
				
			}

        };

        var go = function(direction, position) {

            // only if we're not already doing things
            if(!state.animating){

                // doing things
                state.animating = true;

                if(position){
                    state.nextslide = position;
                    state.nextindex = position-1;
                }
                else{
                    set_next(direction);
                }

                // fade animation
                if(settings.animtype === 'fade'){

                    if(settings.showmarkers){
                        $m_markers.removeClass('active-marker');
                        $m_markers.eq(state.nextindex).addClass('active-marker');
                    }

                    // fade out current
                    $slides.eq(state.currentindex).fadeOut(settings.animduration);
                    // fade in next
                    $slides.eq(state.nextindex).fadeIn(settings.animduration, function(){

                        // update state variables
                        state.animating = false;
                        state.currentslide = state.nextslide;
                        state.currentindex = state.nextindex;

                    });

                }

                // slide animation
                if(settings.animtype === 'slide'){

                    if(settings.showmarkers){
                        
                        var markerindex = state.nextindex-1;

                        if(markerindex === state.slidecount-2){
                            markerindex = 0;
                        }
                        else if(markerindex === -1){
                            markerindex = state.slidecount-3;
                        }

                        $m_markers.removeClass('active-marker');
                        $m_markers.eq(markerindex).addClass('active-marker');
                    }

                    // if the slider is responsive && the calculated width is less than the max width
                    if(settings.responsive && ( responsive.width < settings.width ) ){
                        state.slidewidth = responsive.width;
                    }
                    else{
                        state.slidewidth = settings.width;
                    }

                    $slider.animate({'left': -state.nextindex * state.slidewidth }, settings.animduration, function(){

                        state.currentslide = state.nextslide;
                        state.currentindex = state.nextindex;

                        // is the current slide a clone?
                        if($slides.eq(state.currentindex).attr('data-clone') === 'last'){

                            // affirmative, at the last slide (clone of first)
                            $slider.css({'left': -state.slidewidth });
                            state.currentslide = 2;
                            state.currentindex = 1;

                        }
                        else if($slides.eq(state.currentindex).attr('data-clone') === 'first'){

                            // affirmative, at the fist slide (clone of last)
                            $slider.css({'left': -state.slidewidth *(state.slidecount - 2)});
                            state.currentslide = state.slidecount - 1;
                            state.currentindex = state.slidecount - 2;

                        }

                        state.animating = false;

                    });

                }

            }

        };

        // lets get the party started :)
        init();

    };

})(jQuery);
