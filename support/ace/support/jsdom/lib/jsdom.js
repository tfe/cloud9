
var dom = exports.dom = require("./jsdom/level3/index").dom;
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.jsdom = function (html, level, options) {
  options = options || {};
  if (!options.url) {
    options.url = module.parent.filename;
  }

  var browser = exports.browserAugmentation(level || exports.defaultLevel, options),
    doc = new browser.HTMLDocument(options);

  doc.write(html || '<html><head></head><body></body></html>');
  if (doc.close && !options.deferClose) {
    doc.close();
  }

  // Kept for backwards-compatibility. The window is lazily created when 
  // document.parentWindow or document.defaultView is accessed.
  doc.createWindow = function() {
    // Remove ourself
    if (doc.createWindow) {
      delete doc.createWindow;
    }
    return doc.parentWindow;
  };

  return doc;
};

exports.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
      jQueryTag = window.document.createElement("script");

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }

  jQueryTag.src = path || 'http://code.jquery.com/jquery-latest.js';
  window.document.body.appendChild(jQueryTag);
  
  jQueryTag.onload = function() {
    if (callback) {
      callback(window, window.jQuery);
    }
  };

  return window;
};
