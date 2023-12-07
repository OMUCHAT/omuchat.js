import type { Keyable, Model } from '@omuchat/omu.js/src/interface';

export interface ChannelJson {
    provider_id: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    icon_url: string;
    created_at: number;
}

export class Channel implements Keyable, Model<ChannelJson> {
    provider_id: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    icon_url: string;
    created_at: number;

    constructor(option: ChannelJson) {
        this.provider_id = option.provider_id;
        this.id = option.id;
        this.url = option.url;
        this.name = option.name;
        this.description = option.description;
        this.active = option.active;
        this.icon_url = option.icon_url;
        this.created_at = option.created_at;
    }

    static fromJson(json: ChannelJson): Channel {
        return new Channel(json);
    }

    key(): string {
        return this.url;
    }

    json(): ChannelJson {
        return {
            provider_id: this.provider_id,
            id: this.id,
            url: this.url,
            name: this.name,
            description: this.description,
            active: this.active,
            icon_url: this.icon_url,
            created_at: this.created_at,
        };
    }
}
