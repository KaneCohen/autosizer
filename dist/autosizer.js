module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * Automatically resize textarea to fit text when typing.
	 * autosizer 1.1.0
	 * Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
	 * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
	 * Available under BSD-3-Clause license
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _cloneStyles = {
	  position: 'fixed',
	  top: '-9999px',
	  left: '-9999px',
	  height: 'auto',
	  overflow: 'hidden',
	  overflowY: 'hidden',
	  wordWrap: 'break-word',
	  minHeight: null,
	  zIndex: 1000
	};

	var _defaults = {
	  isFocused: false,
	  maxHeight: null,
	  follow: true,
	  styles: ['width', 'padding', 'lineHeight', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent', 'boxSizing']
	};

	function scrollTop(top) {
	  var doc = document.documentElement;
	  if (typeof top === 'undefined') {
	    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	  } else {
	    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	    window.scrollTo(left, top);
	  }
	}

	var Autosizer = (function () {
	  function Autosizer(el) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Autosizer);

	    if (el.nodeName) {
	      this.el = el;
	    } else if (typeof el !== 'undefined') {
	      this.el = document.querySelector(el);
	    } else {
	      throw 'Error: No element found.';
	    }

	    this.o = Object.assign({}, _defaults, options);
	    this._events = {};

	    this._setListeners();
	  }

	  _createClass(Autosizer, [{
	    key: '_createClone',
	    value: function _createClone() {
	      var styles = {};
	      var el = this.el;

	      var clone = document.createElement('textarea');
	      var computedStyles = window.getComputedStyle(el);

	      this.o.styles.forEach(function (style) {
	        styles[style] = computedStyles[style];
	      });

	      Object.assign(styles, _cloneStyles);
	      Object.keys(styles).forEach(function (key) {
	        clone.style[key] = styles[key];
	      });

	      clone.value = el.value;
	      document.body.appendChild(clone);

	      this.clone = clone;
	    }
	  }, {
	    key: '_setListeners',
	    value: function _setListeners() {
	      this._events.onFocusIn = this._onFocusIn.bind(this);
	      this._events.onFocusOut = this._onFocusOut.bind(this);

	      this.el.addEventListener('focusin', this._events.onFocusIn);
	      this.el.addEventListener('focusout', this._events.onFocusOut);
	    }
	  }, {
	    key: '_onFocusIn',
	    value: function _onFocusIn() {
	      this.isFocused = true;
	      this._createClone(this);
	      this._events.onInput = this._onInput.bind(this);
	      this.el.addEventListener('input', this._events.onInput);
	      this.update();
	    }
	  }, {
	    key: '_onFocusOut',
	    value: function _onFocusOut() {
	      this.isFocused = true;
	      this.el.removeEventListener('input', this._events.onInput);
	      this.clone.remove();
	      this.clone = null;
	    }
	  }, {
	    key: '_onInput',
	    value: function _onInput() {
	      this.update();
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      if (!this.clone) {
	        this._createClone(this);
	      }

	      var diff = 0;
	      var bottom = 0;
	      var o = this.o;
	      var el = this.el;
	      var clone = this.clone;

	      clone.value = el.value;

	      var rows = Math.ceil((clone.scrollHeight - (parseInt(clone.style.paddingTop, 10) + parseInt(clone.style.paddingBottom, 10))) / parseFloat(clone.style.lineHeight));

	      if (o.follow) {
	        bottom = el.getBoundingClientRect().bottom;
	        el.setAttribute('rows', rows);
	        diff = el.getBoundingClientRect().bottom - bottom;
	        scrollTop(scrollTop() + diff);
	      } else {
	        el.setAttribute('rows', rows);
	      }

	      if (!this.isFocused) {
	        this.clone.remove();
	        this.clone = null;
	      }

	      return this;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var el = this.el;

	      if (this.clone) this.clone.remove();
	      el.style.overflow = this._overflow;

	      this.el.removeEventListener('focusin', this._events.onFocusIn);
	      this.el.removeEventListener('focusout', this._events.onFocusOut);
	    }
	  }]);

	  return Autosizer;
	})();

	exports['default'] = Autosizer;
	module.exports = exports['default'];

/***/ }
/******/ ]);