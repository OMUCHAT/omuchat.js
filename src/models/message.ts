import type { Keyable, Model } from '@omuchat/omu.js/src/interface';

import type { ContentJson } from './content';
import { ContentComponent, TextContent } from './content';
import type { GiftJson } from './gift';
import { Gift } from './gift';
import type { PaidJson } from './paid';
import { Paid } from './paid';

export interface MessageJson {
    room_id: string;
    id: string;
    author_id?: string;
    content?: ContentJson;
    paid?: PaidJson;
    gift?: GiftJson;
    created_at?: string; // ISO 8601 date string
}

export class Message implements Keyable, Model<MessageJson> {
    room_id: string;
    id: string;
    author_id?: string;
    content?: ContentComponent;
    paid?: Paid;
    gift?: Gift;
    created_at?: Date;

    constructor(options: {
        room_id: string;
        id: string;
        author_id?: string;
        content?: ContentComponent;
        paid?: Paid;
        gift?: Gift;
        created_at?: Date;
    }) {
        if (this.created_at && !(this.created_at instanceof Date)) {
            throw new Error('created_at must be a Date');
        }
        this.room_id = options.room_id;
        this.id = options.id;
        this.author_id = options.author_id;
        this.content = options.content;
        this.paid = options.paid;
        this.gift = options.gift;
        this.created_at = options.created_at;
    }

    static fromJson(info: MessageJson): Message {
        return new Message({
            room_id: info.room_id,
            id: info.id,
            author_id: info.author_id,
            content: info.content && ContentComponent.fromJson(info.content),
            paid: info.paid && Paid.fromJson(info.paid),
            gift: info.gift && Gift.fromJson(info.gift),
            created_at: info.created_at ? new Date(info.created_at) : undefined,
        });
    }

    get text(): string {
        if (!this.content) {
            return '';
        }
        const parts: string[] = [];
        const components = [this.content];
        while (components.length) {
            const component = components.shift();
            if (!component) {
                continue;
            }
            if (component instanceof TextContent) {
                parts.push(component.text);
            }
            if (component.siblings) {
                components.push(...component.siblings);
            }
        }
        return parts.join('');
    }

    key(): string {
        return `${this.room_id}#${this.id}`;
    }

    json(): MessageJson {
        return {
            room_id: this.room_id,
            id: this.id,
            author_id: this.author_id,
            content: this.content?.json(),
            paid: this.paid?.json(),
            gift: this.gift?.json(),
            created_at: this.created_at?.toISOString(),
        };
    }

    toString(): string {
        return `${this.author_id}: ${this.content}`;
    }
}
