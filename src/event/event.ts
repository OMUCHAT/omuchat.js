import { Message } from '../models';

export class EventKey<T> {
    constructor(
        public readonly name: string,
        public readonly type?: T,
    ) {}
}

export const events = {
    Ready: new EventKey('ready'),
    MessageCreate: new EventKey('on_message', Message),
    MessageUpdate: new EventKey('on_message_update', Message),
    MessageDelete: new EventKey('on_message_delete', Message),
};
