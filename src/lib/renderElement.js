import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";

const OldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  if (!vNode) return;
  const newNode = normalizeVNode(vNode);

  const oldNode = OldNodeMap.get(container);

  if (!oldNode) {
    container.appendChild(createElement(newNode));
  } else {
    container.innerHTML = "";
    container.appendChild(createElement(newNode));
  }
  OldNodeMap.set(container, newNode);

  setupEventListeners(container);

  return container;
}
