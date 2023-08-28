/* From: 
https://stackoverflow.com/questions/11700927/horizontal-scrolling-with-mouse-wheel-in-a-div
https://jsfiddle.net/q3pf2hge
*/

jQuery(function ($) {
  $.fn.hScroll = function (amount) {
    amount = amount || 120;
    $(this).bind("DOMMouseScroll mousewheel", function (event) {
      var oEvent = event.originalEvent,
        direction = oEvent.detail
          ? oEvent.detail * -amount
          : oEvent.wheelDelta,
        position = $(this).scrollLeft();
      position += direction > 0 ? -amount : amount;
      $(this).scrollLeft(position);
      event.preventDefault();
    });
  };
});