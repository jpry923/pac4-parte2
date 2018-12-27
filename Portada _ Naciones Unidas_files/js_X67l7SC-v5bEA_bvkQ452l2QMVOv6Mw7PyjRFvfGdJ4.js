Drupal.locale = { 'strings': {"":{"Member State":"Estado Miembro","Date of Admission":"Fecha de admisi\u00f3n","Back to top":"Ir al inicio de la p\u00e1gina.","No Journal found for that date.":"\u00a1Oh! Por favor, seleccione otra fecha."}} };;
/*global jQuery */
/*!
* FlexVerticalCenter.js 1.0
*
* Copyright 2011, Paul Sprangers http://paulsprangers.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Fri Oct 28 19:12:00 2011 +0100
*/
(function( $ ){

  $.fn.flexVerticalCenter = function( options ) {
    var settings = $.extend({
      cssAttribute:   'margin-top', // the attribute to apply the calculated value to
      verticalOffset: 0,            // the number of pixels to offset the vertical alignment by
      parentSelector: null,         // a selector representing the parent to vertically center this element within
      debounceTimeout: 25,          // a default debounce timeout in milliseconds
      referenceSelector: '.image-wrapper'       // a container that is not in the parent path of the object
    }, options || {});

    return this.each(function(){
      var $this   = $(this); // store the object
      var debounce;

      // recalculate the distance to the top of the element to keep it centered
      var resizer = function () {

        var parentHeight = (settings.parentSelector && $this.parents(settings.parentSelector).length)
                           ? $this.parents(settings.parentSelector).first().height()
                           : $this.parent().height();

        if (settings.referenceSelector) {
          parentHeight = $(settings.referenceSelector).first().height();
        }

        $this.css(
          settings.cssAttribute, ( ( ( parentHeight - $this.height() ) / 2 ) + parseInt(settings.verticalOffset) )
        );
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).resize(function () {
          clearTimeout(debounce);
          debounce = setTimeout(resizer, settings.debounceTimeout);
      });

      // Apply a load event to images within the element so it fires again after an image is loaded
      $this.find('img').load(resizer);

    });

  };

})( jQuery );;
(function ($) {

    $(document).ready(function() {

        if ($('#homepage-carousel-stub').length) {
            $("#homepage-carousel-stub").load("/"+Drupal.settings.theme.language+"/rendered-carousel/?embed=1", loadHomepageCarousel );
        } else {
            loadHomepageCarousel();
            loadAboutCarousel();
        }

        // flexVerticalCenter plugin
        $('.owl-controls').flexVerticalCenter({ cssAttribute: 'padding-top' }); // Vertically centre Owl Slider nav
    });

function loadHomepageCarousel() {
    if ($('.front-owl-carousel').length){

        $(".front-owl-carousel").owlCarousel({
            autoplay: false,
            lazyLoad : false,
            nav: true,
            navigationText : false,
            loop: false,
            items: 1,
            dots: false,
            autoHeight:  true,
            animateOut: 'fadeOut',
            addClassActive: true,
            video: true,
            rtl: Drupal.settings.un_carousel.rtl
        });
        
        $('#un-carousel .thumbnails .thumb-link').click(function(){
        //add active
        $('#un-carousel .thumbnails .item').removeClass('active');
        $(this).parent().addClass('active');
        
        $(".front-owl-carousel").trigger("goTo", [$(this).parent().index(), 200, true]);
        
        return false;
    });
        
      //next
      $('#un-carousel .next').click(function(){
        if (document.documentElement.clientWidth < 1200) {
            $('#un-carousel .thumbnails').animate({top: '-464px'},function(){
                $('#un-carousel .next').hide(0, function(){
                    $('#un-carousel .prev').show(0);
                });
            });
        } else 
        $('#un-carousel .thumbnails').animate({top: '-564px'},function(){
            $('#un-carousel .next').hide(0, function(){
                $('#un-carousel .prev').show(0);
            });
        });
        return false;
      });
      
      //prev
      $('#un-carousel .prev').click(function(){
        $('#un-carousel .thumbnails').animate({top: '0px'},function(){
            $('#un-carousel .prev').hide(0, function(){
                $('#un-carousel .next').show(0);
            });
        });
        return false;
      });
  }
}

function loadAboutCarousel(){
  //about un carousel
  if ($('.about-un-carousel').length) {
    $("#un-carousel").owlCarousel({
        autoplay: false,
        lazyLoad : true,
        nav: false,
        loop: true,
        items: 1,
        dots: true,
        autoHeight:  true,
        theme: 'owl-theme owl-un',
        animateOut: 'fadeOut',
        addClassActive: true,
        rtl: Drupal.settings.un_carousel.rtl
    });
    $(".block-un-carousel .next").click(function(e){
      $("#un-carousel").trigger('next');
      e.preventDefault();
    });
    $(".block-un-carousel .prev").click(function(e){
      $("#un-carousel").trigger('prev');
      e.preventDefault();
    });
  }
}

})(jQuery);
;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox') && (Drupal.settings.googleanalytics.trackColorbox)) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Downloads",
            "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
            "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", {
            "hitType": "pageview",
            "page": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Mails",
            "eventAction": "Click",
            "eventLabel": this.href.substring(7),
            "transport": "beacon"
          });
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode !== 2 || (Drupal.settings.googleanalytics.trackDomainMode === 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Outbound links",
              "eventAction": "Click",
              "eventLabel": this.href,
              "transport": "beacon"
            });
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga("send", {
        "hitType": "pageview",
        "page": location.pathname + location.search + location.hash
      });
    };
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  if (Drupal.settings.googleanalytics.trackColorbox) {
    $(document).bind("cbox_complete", function () {
      var href = $.colorbox.element().attr("href");
      if (href) {
        ga("send", {
          "hitType": "pageview",
          "page": Drupal.googleanalytics.getPageUrl(href)
        });
      }
    });
  }

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);
;
