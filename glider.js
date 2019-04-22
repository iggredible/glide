if (window.HTMLCollection && !window.HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

(function() {
  "use strict";
  console.log("called");
})();
