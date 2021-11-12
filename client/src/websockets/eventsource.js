export class EventSource {
    #events = {};

    on(eventName, callback) {
        if (!this.#events[eventName]) {
            this.#events[eventName] = [];
        }
        const handlers = this.#events[eventName];
        handlers.push(callback);
    }

    off(eventName, callback) {
        if (!this.#events[eventName]) {
            return;
        }
        const handlers = this.#events[eventName];
        const index = handlers.indexOf(callback);
        if (index > -1) {
            handlers.splice(index, 1);
        }
    }

    trigger(eventName, ...args) {
        if (!this.#events[eventName]) {
            return;
        }
        const handlers = this.#events[eventName];
        handlers.forEach(handler => {
            if (typeof handler === 'function') {
                handler(...args);
            }
        });
    }
}