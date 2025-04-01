const events = [];

export function setupEventListeners(root) {
  const eventTypes = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].root === root) {
      if (eventTypes.indexOf(events[i].eventType) === -1) {
        eventTypes.push(events[i].eventType);
      }
    }
  }

  for (let i = 0; i < eventTypes.length; i++) {
    const type = eventTypes[i];
    root.addEventListener(type, function (event) {
      for (
        let target = event.target;
        target && target !== root;
        target = target.parentNode
      ) {
        for (let j = 0; j < events.length; j++) {
          if (
            events[j].element === target &&
            events[j].eventType === type &&
            events[j].root === root
          ) {
            events[j].handler(event);
          }
        }
      }
    });
  }
}

export function addEvent(element, eventType, handler) {
  const root = element.parentNode;

  events.push({
    element: element,
    eventType: eventType,
    handler: handler,
    root: root,
  });

  return { element, eventType, handler };
}

export function removeEvent(element, eventType, handler) {
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].element === element &&
      events[i].eventType === eventType &&
      events[i].handler === handler
    ) {
      events.splice(i, 1);
    }
  }
}
