const defaults = {
  viewportMargin: null,
  follow: true,
  triggers: ['input', 'change', 'focus']
};

function scrollTop(top: number | void): number {
  let doc = document.documentElement;

  if (typeof top !== 'undefined') {
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    window.scrollTo(left, top);
  }
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
}

interface AutosizerElement extends HTMLTextAreaElement {
  autosizer?: Autosizer;
}

type Options = {
  viewportMargin: number | null;
  follow: boolean;
  triggers: string[];
};

class Autosizer {
  el: AutosizerElement;
  private options: Options;
  private isUserResized: boolean = false;
  private height: number | string;
  private x: number | null = null;
  private y: number | null = null;

  constructor(el: HTMLTextAreaElement, options: Partial<Options> = {}) {
    this.el = el as AutosizerElement;
    this.options = {...defaults, ...options};
    this.height = this.el.style.height;

    this.initListeners();

    this.el.autosizer = this;
  }

  private initListeners() {
    this.onTrigger = this.onTrigger.bind(this);
    this.onResize = this.onResize.bind(this);

    this.options.triggers.forEach((event: string) => {
      this.el.addEventListener(event, this.onTrigger);
    });
    this.el.addEventListener('mousemove', this.onResize);

    if (this.el.form) {
      this.onReset = this.onReset.bind(this);
      this.el.addEventListener('reset', this.onReset);
    }
  }

  private onTrigger(): void {
    this.resize();
  }

  private onResize(e: MouseEvent): void {
    if (this.x !== e.clientX || this.y !== e.clientY) {
      const newHeight = this.el.style.height;

      if (this.height && this.height !== newHeight) {
        this.isUserResized = true;
        this.el.style.maxHeight = '';
        this.el.removeEventListener('mousemove', this.onResize);
      }
    }
  }

  private onReset(): void {
    this.isUserResized = false;
    this.el.style.height = '';
    this.el.style.maxHeight = '';
  }

  private getOverflowOffset(): {top: number, bottom: number} {
    const document = this.el.ownerDocument;
    const documentEl = document.documentElement;

    let offsetTop = 0;
    let el: HTMLElement | null = this.el;
    while (el !== document.body && el !== null) {
      offsetTop += el.offsetTop || 0;
      el = el.offsetParent as HTMLElement;
    }

    const top = offsetTop - document.defaultView!.pageYOffset;
    const bottom = documentEl.clientHeight - (top + this.el.offsetHeight);

    return {top, bottom};
  }

  resize(): void {
    if (this.isUserResized) return;
    if (this.el.offsetWidth <= 0 && this.el.offsetHeight <= 0) return;

    const { top, bottom } = this.getOverflowOffset();
    if (!this.options.follow && (top < 0 || bottom < 0)) return;

    let style = getComputedStyle(this.el);
    const topBorder = Number(style.borderTopWidth.replace(/px/, ''));
    const bottomBorder = Number(style.borderBottomWidth.replace(/px/, ''));
    const isBorderBox = style.boxSizing === 'border-box';
    const borderAdjust = isBorderBox ? topBorder + bottomBorder : 0;

    if (this.options.viewportMargin !== null) {
      const maxHeight = Number(style.height.replace(/px/, '')) + bottom;
      const adjustViewportMargin = bottom < this.options.viewportMargin ? bottom : this.options.viewportMargin;
      this.el.style.maxHeight = `${maxHeight - adjustViewportMargin}px`;
    }

    const container = this.el.parentElement;
    const followBottom = this.el.getBoundingClientRect().bottom;

    if (container) {
      const containerHeight = container.style.height;
      container.style.height = getComputedStyle(container).height;
      this.el.style.height = 'auto';
      this.el.style.height = `${this.el.scrollHeight + borderAdjust}px`;
      container.style.height = containerHeight;
      this.height = this.el.style.height;
      if (this.options.follow) {
        const diff = this.el.getBoundingClientRect().bottom - followBottom;
        scrollTop(scrollTop() + diff);
      }
    }
  }

  destroy() {
    this.options.triggers.forEach((event: string) => {
      this.el.removeEventListener(event, this.onTrigger);
    });
    this.el.removeEventListener('mousemove', this.onResize);
    this.el.removeEventListener('reset', this.onReset);

    delete this.el.autosizer;
  }
}

export default Autosizer;
