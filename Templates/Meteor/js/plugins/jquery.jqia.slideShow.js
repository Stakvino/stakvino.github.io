var jQuery = require('./../vendor/jquery-1.11.2.min.js');

(function($) {
   var namespace = 'jqiaSlideShow';
   var currentSlideNumber = 0;
   var timerId = null; 
  
   var methods = {
      init: function(options) {
         options = $.extend(true, {}, $.fn.jqiaSlideShow.defaults, options);
         
         // Test if the plugin has already been initialized on one or more elements
         if (
            this.filter(function() {
               return $(this).data(namespace);
            }).length !== 0
            ) {
            $.error('The plugin has already been initialized');
         }

         this.data(namespace, options);

         var $sliderContainer = this.addClass("slider-container");
         var containerWidth = $sliderContainer.width();
         var $sliders = $sliderContainer.children().addClass("slider-item")
         .each(function(index){
           $(this).css("left", index == 0 ? 0 : -$sliderContainer.width());
         });
         
         if(options.controls){
           $sliderContainer.append( $(`<div class="controls-container">
                                        <div class="select-slides-container"></div>
                                       </div>`) );
           var $selectSlidesContainer = $("div.select-slides-container", $sliderContainer);
           $sliders.each(function(index){
             $selectSlidesContainer.append(`<button class="select-slide-control"></button>`);
             if(index == 0){
               $("button", $selectSlidesContainer).addClass("selected-slide-control");
             }
           });
           $selectSlidesContainer.find("button.select-slide-control").each(function(index){
             var selectSlideControl = $(this);
             selectSlideControl.click(function(){
               methods.pause();
               methods.goToSlide.call($sliderContainer, index);
               if(options.autoplay){
                 methods.play.call($sliderContainer);
               }
             });
           });
         }
         
         methods.play.call($sliderContainer);
           
         return this;
      },
      goToSlide: function(slideNumber){
        var $sliderContainer = this;
        var $sliders = $sliderContainer.find(".slider-item");
        var options = $sliderContainer.data(namespace);
        
        if(slideNumber == currentSlideNumber){
          return ;
        }
        $sliders.eq(slideNumber).css("left", `${slideNumber > currentSlideNumber ?
                                     "100%" : "-100%"}`);
        $sliders.eq(currentSlideNumber).animate({left :`${slideNumber > currentSlideNumber ?
                                           "-100%" : "100%"}`},options.animationDuration);
        $sliders.eq(slideNumber).animate({left : 0}, options.animationDuration);
        currentSlideNumber = slideNumber;
        
        if(options.translateContent){
          var content = $sliders.eq(slideNumber).find(".fade-translate");
          var leftValue = $sliderContainer.width() / 2;
          leftValue = leftValue * (slideNumber == 0 ? -1 : 1);
          content.css("left", `${leftValue}px`).hide();
          content.animate({left: 0},{ duration: 600, queue: false });
          content.fadeIn({ duration: 600, queue: false });
        }
        if(options.controls){
          var $selectSlidesContainer = $("div.select-slides-container", $sliderContainer);
          $selectSlidesContainer.find(".selected-slide-control").removeClass("selected-slide-control");
          $selectSlidesContainer.find(".select-slide-control").eq(slideNumber).addClass("selected-slide-control");
        }
      },
      play: function(){
        var $sliderContainer = this;
        var $sliders = $sliderContainer.find(".slider-item");
        var options = $sliderContainer.data(namespace);
        
        timerId = setInterval(function(){
          var nextSlideNumber = (currentSlideNumber + 1)%$sliders.length;
          methods.goToSlide.call(this, nextSlideNumber);
        }.bind(this), options.delay * 1000);
        
      },
      pause: function(){
        clearInterval(timerId);
      }
   };

   $.fn.jqiaSlideShow = function(method) {
      if (methods[method]) {
         return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if ($.type(method) === 'object') {
         return methods.init.apply(this, arguments);
      } else {
         $.error('Method ' + method + ' does not exist on jQuery.jqiaSlideShow');
      }
   };

   $.fn.jqiaSlideShow.defaults = {
     delay: 4, //4 seconds
     autoplay: true,
     controls: true,
     animationDuration: 400,
     translateContent: false
   };
})(jQuery);