/**
 * Automatically resize textarea to fit in typed text.
 * version 0.1.0
 * Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
 * @preserve
 */
(function() {

  'use strict';

  var hasModule = (typeof module !== 'undefined' && module.exports),
      cloneStyles = {
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        height: 'auto',
        overflow: 'hidden',
        overflowY: 'hidden',
        wordWrap: 'break-word',
        minHeight: null,
        zIndex: 1000
      },
      defaults = {
        maxHeight: null,
        styles: ['width', 'padding', 'lineHeight', 'fontFamily', 'fontSize', 'fontWeight',
                 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing',
                 'textIndent', 'boxSizing'
        ]
      };

  if (window.jQuery) {
    jQuery.fn.autosizer = function(options) {
      var args = arguments, as = null;
      var o = jQuery.extend(true, {}, options);

      this.each(function() {
        o.element = jQuery(this);
        as = util.data(this, 'autosizer');
        if (as) {
          as.trigger.apply(as, args);
        } else if (jQuery.type(options) != 'string') {
          new Autosizer(this, o);
        }
      });

      return this;
    };
  }

  var util = {

    remove: function(el) {
      el.parentNode.removeChild(el);
    },

    data: function(el, prop, value) {
      var p = 'data';
      var data = el[p] || {};
      if (typeof value === 'undefined') {
        if (el[p] && el[p][prop]) {
          return el[p][prop];
        } else {
          var dataAttr = el.getAttribute(p + '-' + prop);
          if (typeof dataAttr !== 'undefined') {
            return dataAttr;
          }
          return null;
        }
      } else {
        data[prop] = value;
        el[p] = data;
        return el;
      }
    },

    on: function(el, events, handler) {
      var prevEvents = this.data(el, 'events') || {},
          ev, i;
      if (typeof events === 'string') {
        events = events.match(/[\S]+/g);
        for (i = 0; i < events.length; i++) {
          ev = events[i];
          if (prevEvents[ev]) {
            prevEvents[ev].push(handler);
          } else {
            prevEvents[ev] = [handler];
          }
          el.addEventListener(ev.split('.')[0], handler);
        }
        this.data(el, 'events', prevEvents);
      }
    },

    off: function(el, events, handler) {
      var prevEvents = this.data(el, 'events') || {},
          ev, i, k;
      if (typeof events === 'string') {
        events = events.match(/[\S]+/g);
        for (i = 0; i < events.length; i++) {
          ev = events[i];
          if (handler) {
            el.removeEventListener(ev.split('.')[0], handler);
          } else if (prevEvents[ev]) {
            prevEvents[ev].forEach(function(handler, k) {
              el.removeEventListener(ev.split('.')[0], handler);
              prevEvents[k] = prevEvents[ev].slice(k+1);
            });
          } else if (ev[0] === '.') {
            for (k in prevEvents) {
              if (k.indexOf(ev) > -1) {
                prevEvents[k].forEach(function(handler, j) {
                  el.removeEventListener(k.split('.')[0], handler);
                  prevEvents[k] = prevEvents[k].slice(j+1);
                });
              }
              if (prevEvents[k].length === 0) {
                delete prevEvents[k];
              }
            }
          }
        }
      }
    },

    trim: function(string) {
      return string.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '');
    },

    extend: function(target, source) {
      for(var key in source) {
        if(source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
      return target;
    },

    scrollTop: function(top) {
      var doc = document.documentElement;
      if (typeof top === 'undefined') {
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      } else {
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        window.scrollTo(left, top);
      }
    }

  };

  function styleSetup(a) {
    var maxHeight = a.el.style.maxHeight;
    a._overflow = a.el.style.overflow;
    if (maxHeight !== '') {
      maxHeight = parseInt(maxHeight, 10);
    } else {
      maxHeight = null;
      a.el.style.overflow = 'hidden';
    }
    a.o.maxHeight = maxHeight;
  }

  function createClone(a) {
    var clone = a._clone = document.createElement('textarea');
    var computedStyles = window.getComputedStyle(a.el);
    var styles = {};
    a.o.styles.forEach(function(v) {
      styles[v] = computedStyles[v];
    });
    util.extend(styles, cloneStyles);

    for (var k in styles) {
      if (styles.hasOwnProperty(k)) {
        clone.style[k] = styles[k];
      }
    }
    clone.value = a.el.value;
    document.body.appendChild(clone);
  }

  function listen(a) {
    util.on(a.el, 'focusin.autosizer', function() {
      update(a);
      createClone(a);
      util.on(a.el, 'keyup.autosizer input.autosizer', function() {
        update(a);
      });
    });
    util.on(a.el, 'focusout.autosizer', function() {
      util.off(a.el, 'keyup.autosizer');
      util.remove(a._clone);
      a._clone = null;
    });
  }

  function destroy(a) {
    util.off(a.el, '.autosizer');
    if (a._clone) util.remove(a._clone);
    a.el.style.overflow = a._overflow;
  }

  function update(a) {
    var diff, bottom;
    if (a._clone) {
      a._clone.value = a.el.value;
      a._clone.style.height = 'auto';
      a._clone.style.height = a._clone.scrollHeight - (parseInt(a._clone.style.paddingTop) + parseInt(a._clone.style.paddingBottom)) + 'px';
      if (a.o.maxHeight === null || a.o.maxHeight > parseInt(a._clone.style.height, 10)) {
        bottom = a.el.getBoundingClientRect().bottom;
        a.el.style.height = a._clone.style.height;
        diff = a.el.getBoundingClientRect().bottom - bottom;
        util.scrollTop(util.scrollTop() + diff);
      }
    }
  }

  function Autosizer(el, options) {
    if (el.nodeName) {
      this.el = el;
    } else if (typeof el !== 'undefined') {
      this.el = document.querySelector(el);
    } else {
      throw 'Error: No element found.';
    }
    this.o = util.extend(defaults, options);
    styleSetup(this);
    listen(this);
    util.data(el, this);
  }

  Autosizer.prototype = {
    destroy: function() {
      destroy(this);
    },

    trigger: function(name) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (this.v.events[name]) {
        if (this.v.events[name].apply(this, args) === false)
          return false;
      }
      if (this[name]) {
        if (this[name].apply(this, args) === false)
          return false;
      }
      return true;
    }
  };

  if (hasModule) {
    // CommonJS module is defined.
    module.exports = Autosizer;
  } else if (typeof define === 'function' && define.amd) {
    // AMD module is defined.
    define('autosizer', function() {
      return Autosizer;
    });
  }

}).call(this);
