/**
 * @name ShowRealLink
 * @author arminmiau/o4-mini
 * @version 1.0.2
 * @description Shows the real href after an anchor if it has an inner span with text that differs from its href.
 */
class ShowRealLink {
  constructor() {
    this.observer = null;
    this.processed = new WeakSet();
    this.spanClass = "anchor-edefb8-href-span";
    this.selector = "a.anchor_edefb8";
  }

  getName() {
    return "ShowRealLink";
  }

  getAuthor() {
    return "arminmiau/o4-mini";
  }

  getVersion() {
    return "1.0.2";
  }

  start() {
    document.querySelectorAll(this.selector).forEach((a) => this._process(a));

    this.observer = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(this.selector)) this._process(node);
          node.querySelectorAll(this.selector).forEach((a) => this._process(a));
        });
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  stop() {
    if (this.observer) this.observer.disconnect();
    document
      .querySelectorAll(`.${this.spanClass}`)
      .forEach((span) => span.remove());
    this.processed = new WeakSet();
  }

  _process(anchor) {
    if (!anchor.href || this.processed.has(anchor)) return;
    const inner = anchor.querySelector("span");
    // ignore if no inner span or inner span is empty
    if (!inner) return;
    const txt = inner.textContent.trim();
    if (txt === "" || txt === anchor.href) return;

    this.processed.add(anchor);
    const span = document.createElement("span");
    span.className = this.spanClass;
    span.textContent = ` [${anchor.href}]`;
    span.style.fontSize = "0.75em";
    span.style.color = "#999";
    anchor.parentNode.insertBefore(span, anchor.nextSibling);
  }
}

module.exports = ShowRealLink;
