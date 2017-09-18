/**
 * Created by BomWu on 2017-09-13.
 * 异步加载图片轮播插件
 *
 */
(function ($) {
  $.fn.ajaxslider = function (options) {
    var config = {
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

    if (options) {
      $.extend(config, options);
    }

    function build(el, sliderJSON) {
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
        slideIndex = 0,
        intervalID;
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

      startTimer();
      el.on('mouseenter mouseleave', function (e) {
        var onMouEnt = (e.type === 'mouseenter') ?
          clearInterval(intervalID) : startTimer();
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
      };

      function startTimer() {
        intervalID = setInterval(function () {
          buttonNext.click();
        }, config.interval);
        return intervalID;
      };
    }

    return this.each(function () {
      var el = $(this);
      if ($.isArray(config.data)) {
        build(el, config.data);
      } else if (typeof config.data == 'function') {
        var data = config.data.call(window, el);
        build(el, data);
      } else if (typeof config.data == 'string') {
        $.post(config.data, {
          rnd: new Date().getTime()
        }, function (data, status) {
          build(el, data);
        }, 'json');
      }
    });
  };
})(jQuery);
