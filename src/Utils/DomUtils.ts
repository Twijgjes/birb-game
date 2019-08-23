export function createEl(className: string, parent?: HTMLElement) {
  const el = window.document.createElement("div");
  el.className = className;
  if (parent) {
    parent.appendChild(el);
  } else {
    document.body.appendChild(el);
  }
  return el;
}