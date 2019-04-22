if (window.HTMLCollection && !window.HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

(function() {
  "use strict";
  window.Glider = (() => {
    let instanceUid = 0;
    function Glider(el, settings) {
      console.log("el: ", el);
      const _ = this;
      _.el = el;
      _.dots = [];
      _.easing = function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
      };

      _.opt = _.extend(
        {
          prevArrow: true,
          nextArrow: true,
          dots: true,
          slidesToShow: 1
        },
        settings
      );

      _.orgOpt = _.opt;
      _.activateSlide = 0;
      _.instanceUid = instanceUid++;

      _.init();
    }

    return Glider;
    // execute window.Glider. It returns Glider function object
    // window.Glider is the instantiated Glider class
  })();

  console.log("calling function");
  // executing IIFE
  Glider.prototype.extend = function(source, properties) {
    // extends adds into source properties from properties
    // returns source itself
    for (let property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  };

  Glider.prototype.init = function() {
    const _ = this;
    _.track = _.el.children[0];
    _.slides = _.track.children;
    _.slides.forEach(slide => {
      slide.classList.add("glider-slide");
    });
    console.log("slides: ", _.slides);
    _.containerWidth = _.el.offsetWidth;
    _.containerHeight = 0;

    let width = 0,
      height = 0;

    _.itemWidth = Math.floor(_.containerWidth / _.opt.slidesToShow); // containerWidth is 322, slidesToShow 1
    _.slides.forEach(slide => {
      slide.style.height = "auto";
      slide.style.width = _.itemWidth + "px";
      width += _.itemWidth;
      height = Math.max(slide.offsetHeight, height);
    });

    if (_.opt.equalHeight) {
      _.slides.forEach(function(slide) {
        slide.style.height = height + "px";
      });
    }

    _.track.style.width = width + "px";
    _.trackWidth = width;
    _.bindArrows();
    _.showArrows();
  };

  Glider.prototype.bindArrows = function() {
    const _ = this;
    ["prev", "next"].forEach(function(direction) {
      let arrow = _.opt[direction + "Arrow"];
      if (arrow) {
        if (typeof arrow === "string") {
          //because during extend source, prevArrow and nextArrow is set ot true, while new Glider has string ".glider-next". If iti s string, then prev and next Arrow are set
          arrow = document.querySelector(arrow);
        }
        _[direction + "Arrow"] = arrow;
        arrow.addEventListener(
          "click",
          Glider.prototype.scrollItem.bind(_, direction)
        );
      }
    });
  };

  Glider.prototype.scrollItem = function(direction, e) {
    if (e) {
      e.preventDefault();
    }

    const _ = this;
    let num = 1,
      scrollLeft = _.el.scrollLeft;
    if (_.el.scrollLeft >= _.itemWidth) {
      num = Math.ceil(scrollLeft / _.itemWidth);
    }
    if (_.el.scrollLeft === _.itemWidth * num) {
      num++;
    }
    scrollLeft = _.itemWidth * num;
    if (direction === "prev") {
      scrollLeft -= _.itemWidth * 2;
    }
    _.scrollTo(250, scrollLeft);
    _.showArrows();
    return false;
  };

  Glider.prototype.scrollTo = function(scrollDuration, scrollTarget) {
    const _ = this;
    var start = new Date().getTime(),
      animate = function() {
        var now = new Date().getTime() - start;
        _.el.scrollLeft =
          _.el.scrollLeft +
          (scrollTarget - _.el.scrollLeft) *
            _.easing(0, now, 0, 1, scrollDuration);
        // console.log([now, scrollDuration]);
        if (now < scrollDuration) {
          window.requestAnimationFrame(animate);
        }
      };
    window.requestAnimationFrame(animate);
  };

  Glider.prototype.showArrows = function() {
    const _ = this;
    _.prevArrow.classList.toggle("glider-hide", _.el.scrollLeft <= 0);
    _.nextArrow.classList.toggle(
      "glider-hide",
      _.el.scrollLeft + _.el.offsetWidth >= _.trackWidth
    );

    if (_.el.offsetWidth >= _.trackWidth) {
      [_.prevArrow, _.nextArrow].forEach(function(ele) {
        ele.classList.add("glider-hide");
      });
    }

    _.activeSlide = Math.floor(_.el.scrollLeft / _.itemWidth);
    _.dots.forEach(function(dot, index) {
      dot.classList.toggle("glider-active", _.activeSlide === index);
    });
  };
})();
