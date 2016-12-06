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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Automatically resize textarea to fit text when typing.
	 * autosizer 1.3.0
	 * Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
	 * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
	 * Available under BSD-3-Clause license
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _events = __webpack_require__(1);

	var _events2 = _interopRequireDefault(_events);

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
	  styles: ['width', 'padding', 'lineHeight', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent', 'boxSizing'],
	  attributes: ['rows']
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

	var Autosizer = (function (_EventEmitter) {
	  _inherits(Autosizer, _EventEmitter);

	  function Autosizer(el) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Autosizer);

	    _get(Object.getPrototypeOf(Autosizer.prototype), 'constructor', this).call(this);

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

	    this.el.autosizer = this;
	  }

	  _createClass(Autosizer, [{
	    key: '_createClone',
	    value: function _createClone() {
	      var el = this.el;

	      var clone = document.createElement('textarea');
	      var computedStyles = window.getComputedStyle(el);

	      var styles = this.o.styles.reduce(function (styles, style) {
	        styles[style] = computedStyles[style];
	        return styles;
	      }, {});

	      Object.assign(clone.style, styles, _cloneStyles);
	      this.o.attributes.forEach(function (attr) {
	        clone.setAttribute(attr, el.getAttribute(attr));
	      }, {});

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
	      if (this.clone) {
	        this.clone.remove();
	        this.clone = null;
	      }
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

	      clone.setAttribute('rows', el.getAttribute('rows') || 2);

	      var rows = Math.ceil((clone.scrollHeight - (parseInt(clone.style.paddingTop, 10) + parseInt(clone.style.paddingBottom, 10))) / parseFloat(clone.style.lineHeight));

	      clone.setAttribute('rows', rows);
	      var height = clone.getBoundingClientRect().height;

	      if (o.follow) {
	        bottom = el.getBoundingClientRect().bottom;
	        el.style.height = height + 'px';
	        diff = el.getBoundingClientRect().bottom - bottom;
	        scrollTop(scrollTop() + diff);
	      } else {
	        el.style.height = height + 'px';
	      }

	      if (!this.isFocused) {
	        this.clone.remove();
	        this.clone = null;
	      }

	      this.emit('updated', this);

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
	      delete el.autosizer;
	    }
	  }]);

	  return Autosizer;
	})(_events2['default']);

	exports['default'] = Autosizer;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ }
/******/ ]);