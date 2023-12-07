import type { EventKey } from './event';

export type EventHandler<T> = (event: T) => void;

export class EventRegistry {
    private readonly handlers: Map<string, EventHandler<any>[]>;

    constructor() {
        this.handlers = new Map();
    }

    on<T>(event: EventKey<T>, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(event.name) || new Array<EventHandler<T>>();
        handlers.push(handler);
        this.handlers.set(event.name, handlers);
    }

    off<T>(event: EventKey<T>, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(event.name);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }

    emit<T>(event: EventKey<T>, data: T): void {
        const handlers = this.handlers.get(event.name);
        if (handlers) {
            for (const handler of handlers) {
                handler(data);
            }
        }
    }
}
