export function createEl(
  className: string,
  tagName: string = "div",
  parent?: HTMLElement
) {
  const el = window.document.createElement(tagName);
  el.className = className;
  if (parent) {
    parent.appendChild(el);
  } else {
    document.body.appendChild(el);
  }
  return el;
}