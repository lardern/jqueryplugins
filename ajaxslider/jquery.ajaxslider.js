/**
 * Created by BomWu on 2017-09-13.
 * 异步加载图片轮播插件
 *
 */
;(function($) {
  var build = function(el,sliderJSON,config) {
    el.addClass('slider');
    el.css({
      width: config.width,
      height: config.height
    });
    el.append('<button type="button" class="button button-prev">' +
      '<i class="fa fa-chevron-left" aria-hidden="true"></i>' +
      '</button>' +
      '<button type="button" class="button button-next">' +
      '<i class="fa fa-chevron-right" aria-hidden="true"></i>' +
      '</button>');

    var sliderList = $('<ul></ul>'),
      bulletList = $('<ul></ul>');

    $.each(sliderJSON, function (index, element) {
      sliderList.append("<li><a href='#'><img src='" + element.url + "' alt=''></a>" +
        ((element.text==null||element.text=='')?"":"<div class='content'>" + element.text + "</div></li>"));
      bulletList.append("<li id='bullet_" + (index + 1) + "'></li>");
    });

    sliderList.addClass('sliderList');
    bulletList.addClass('bulletList');
    el.append(sliderList);
    el.append(bulletList);

    bulletList.find("li:first-child").addClass('bulletActive');

    var firstSlide = sliderList.find("li:first-child"),
      lastSlide = sliderList.find("li:last-child"),
      buttonPrev = el.find(".button-prev"),
      buttonNext = el.find(".button-next"),
      sliderCount = sliderList.children().length,
      sliderWidth = 100.0 / sliderCount,
      slideIndex = 0;
    if (!config.showPrevNextButton) {
      buttonPrev.hide();
      buttonNext.hide();
    }
    if(!config.showBulletList){
      bulletList.hide();
    }
    lastSlide.clone().prependTo(sliderList);
    firstSlide.clone().appendTo(sliderList);

    sliderList.css({"width": (100 * sliderCount) + "%"});
    sliderList.css({"margin-left": "-100%"});

    sliderList.find("li").each(function (index) {
      var leftPercent = (sliderWidth * index) + "%";
      $(this).css({"left": leftPercent});
      $(this).css({"width": sliderWidth + "%"});
    });

    buttonPrev.on('click', function () {
      slide(slideIndex - 1);
    });
    buttonNext.on('click', function () {
      slide(slideIndex + 1);
    });
    el.find('.bulletList li').on('click', function () {
      var id = ($(this).attr('id').split('_')[1]) - 1;
      slide(id);
    });

    startTimer(el,config.interval);
    el.on('mouseenter mouseleave', function (e) {
      var onMouEnt = (e.type === 'mouseenter') ?
        clearInterval(el.attr('data-interval-id')) : startTimer(el,config.interval);
    });

     function slide(newSlideIndex) {
      var marginLeft = (newSlideIndex * (-100) - 100) + "%";
      sliderList.animate({"margin-left": marginLeft}, config.speed, function () {
        if (newSlideIndex < 0) {
          el.find(".bulletActive").removeClass('bulletActive');
          bulletList.find("li:last-child").addClass("bulletActive");
          sliderList.css({"margin-left": ((sliderCount) * (-100)) + "%"});
          newSlideIndex = sliderCount - 1;
          slideIndex = newSlideIndex;
          return;
        } else if (newSlideIndex >= sliderCount) {
          el.find(".bulletActive").removeClass('bulletActive');
          bulletList.find("li:first-child").addClass("bulletActive");
          sliderList.css({"margin-left": "-100%"});
          newSlideIndex = 0;
          slideIndex = newSlideIndex;
          return;
        }
        el.find(".bulletActive").removeClass('bulletActive');
        bulletList.find('li:nth-child(' + (newSlideIndex + 1) + ')').addClass('bulletActive');
        slideIndex = newSlideIndex;
      });
    }
     function startTimer() {
      var intervalID = setInterval(function () {
        buttonNext.click();
      }, config.interval);
      el.attr('data-interval-id',intervalID);
      return intervalID;
    }
  };


  var methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var  config = $this.data('ajaxslider');

        if(typeof( config) == 'undefined') {

          var defaults = {
            showPrevNextButton: false,
            showBulletList:false,
            height: 300,//高度
            width: 300,//宽度
            interval: 5000,//轮播间隔，ms
            speed: 500,//动画速度,ms
            data: [{
              text: '',
              url: ''
            }]/*取数地址{String}，或 callback函数{Function},或静态数据{Array}*/            
          };

           config = $.extend({}, defaults, options);

          $this.data('ajaxslider',  config);
        } else {
           config = $.extend({},  config, options);
        }

        var el = $(this);
        if ($.isArray(config.data)) {
          build(el, config.data,config);
        } else if (typeof config.data == 'function') {
          var data = config.data.call(window, el);
          build(el, data,config);
        } else if (typeof config.data == 'string') {
          $.post(config.data, {
            rnd: new Date().getTime()
          }, function (data, status) {
            build(el, data,config);
          }, 'json');
        }

        // 代码在这里运行

      });
    },
    destroy: function(options) {
      return $(this).each(function() {
        var $this = $(this);
        clearInterval($this.attr('data-interval-id'));
        $this.removeData('ajaxslider');
      });
    },
    val: function(options) {
      var someValue = this.eq(0).html();

      return someValue;
    }
  };

  $.fn.ajaxslider = function() {
    var method = arguments[0];

    if(methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    } else if( typeof(method) == 'object' || !method ) {
      method = methods.init;
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.ajaxslider' );
      return this;
    }

    return method.apply(this, arguments);

  }

})(jQuery);