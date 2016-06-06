/**
 * Automatically resize textarea to fit text when typing.
 * autosizer 1.0.0
 * Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
 * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
 * Available under BSD-3-Clause license
 */

const _cloneStyles = {
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

const _defaults = {
  isFocused: false,
  maxHeight: null,
  follow: true,
  styles: [
    'width', 'padding', 'lineHeight', 'fontFamily', 'fontSize', 'fontWeight',
    'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent',
    'boxSizing'
  ]
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

class Autosizer {
  constructor(el, options = {}) {
    if (el.nodeName) {
      this.el = el;
    } else if (typeof el !== 'undefined') {
      this.el = document.querySelector(el);
    } else {
      throw 'Error: No element found.';
    }

    this.o = Object.assign({}, _defaults, options);
    this._events = {};

    this._styleSetup();
    this._setListeners();
  }

  _styleSetup() {
    var maxHeight = this.el.style.maxHeight;
    this._overflow = this.el.style.overflow;
    if (maxHeight !== '') {
      maxHeight = parseInt(maxHeight, 10);
    } else {
      maxHeight = null;
      this.el.style.overflow = 'hidden';
    }
    this.o.maxHeight = maxHeight;
  }

  _createClone() {
    let styles = {};
    const { el } = this;
    const clone = document.createElement('textarea');
    const computedStyles = window.getComputedStyle(el);

    this.o.styles.forEach(function(style) {
      styles[style] = computedStyles[style];
    });

    Object.assign(styles, _cloneStyles);
    Object.keys(styles).forEach((key) => {
      clone.style[key] = styles[key];
    });

    clone.value = el.value;
    document.body.appendChild(clone);

    this.clone = clone;
  }

  _setListeners() {
    this._events.onFocusIn = this._onFocusIn.bind(this);
    this._events.onFocusOut = this._onFocusOut.bind(this);

    this.el.addEventListener('focusin', this._events.onFocusIn);
    this.el.addEventListener('focusout', this._events.onFocusOut);
  }

  _onFocusIn() {
    this.isFocused = true;
    this._createClone(this);
    this._events.onInput = this._onInput.bind(this);
    this.el.addEventListener('input', this._events.onInput);
    this.update();
  }

  _onFocusOut() {
    this.isFocused = true;
    this.el.removeEventListener('input', this._events.onInput);
    this.clone.remove();
    this.clone = null;
  }

  _onInput() {
    this.update();
  }

  update() {
    if (! this.clone) {
      this._createClone(this);
    }
    let diff = 0;
    let bottom = 0;
    const { o, el, clone } = this;

    clone.value = el.value;
    clone.style.height = 'auto';
    clone.style.height = clone.scrollHeight + (
        parseInt(clone.style.paddingTop, 10)
      ) + 'px';

    if (o.maxHeight === null || o.maxHeight > parseInt(clone.style.height, 10)) {
      if (o.follow) {
        bottom = el.getBoundingClientRect().bottom;
        el.style.height = clone.style.height;
        diff = el.getBoundingClientRect().bottom - bottom;
        scrollTop(scrollTop() + diff);
      } else {
        el.style.height = clone.style.height;
      }
    }

    if (! this.isFocused) {
      this.clone.remove();
      this.clone = null;
    }

    return this;
  }

  destroy() {
    const { el } = this;
    if (this.clone) this.clone.remove();
    el.style.overflow = this._overflow;

    this.el.removeEventListener('focusin', this._events.onFocusIn);
    this.el.removeEventListener('focusout', this._events.onFocusOut);
  }
}

export default Autosizer;
