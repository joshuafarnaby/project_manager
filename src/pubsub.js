export const pubsub = (() => {
  const events = {}

  const subscribe = (evName, fn) => {
    events[evName] = events[evName] || [];
    events[evName].push(fn);
  }

  const publish = (evName, data) => {
    if (events[evName]) {
      events[evName].forEach(fn => fn(data));
    }
  }

  return {
    subscribe,
    publish
  }
})();