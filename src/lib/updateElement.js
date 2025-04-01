import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  for (const key in oldProps) {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (!newProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    }
    if (key !== "children") {
      if (!(key in newProps)) {
        if (key === "className") {
          target.removeAttribute("class");
        } else {
          target.removeAttribute(key);
        }
      }
    }
  }

  for (const key in newProps) {
    if (key.startsWith("on") && typeof newProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key] !== newProps[key]) {
        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        addEvent(target, eventType, newProps[key]);
      }
    }

    if (key !== "children") {
      if (oldProps[key] !== newProps[key]) {
        // className 특별 처리
        if (key === "className") {
          target.setAttribute("class", newProps[key]);
        } else {
          target.setAttribute(key, newProps[key]);
        }
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      if (typeof oldNode === "object") {
        parentElement.replaceChild(
          document.createTextNode(String(newNode)),
          parentElement.childNodes[index],
        );
      } else {
        parentElement.childNodes[index].textContent = String(newNode);
      }
    }
    return;
  }

  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
}
