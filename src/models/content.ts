import type { Model } from '@omuchat/omu.js/src/interface';

export type ContentJson = RootContentJson | TextContentJson | ImageContentJson;
export type Content = RootContent | TextContent | ImageContent;

export interface ContentComponentJson<T extends string = string> {
    type: T;
    siblings?: ContentJson[];
}

export class ContentComponent implements Model<ContentComponentJson> {
    protected constructor(
        public type: string,
        public siblings?: Content[],
    ) {}

    static fromJson(json: ContentJson): Content {
        switch (json.type) {
        case 'text':
            return new TextContent(json.text, json.siblings?.map(s => ContentComponent.fromJson(s)));
        case 'image':
            return new ImageContent(json.url, json.id, json.siblings?.map(s => ContentComponent.fromJson(s)));
        case 'root':
            return new RootContent(json.siblings?.map(s => ContentComponent.fromJson(s)));
        default:
            throw new Error(`Unknown content type ${json}`);
        }
    }

    json(): ContentJson {
        throw new Error('Not implemented');
    }
}

export interface RootContentJson extends ContentComponentJson<'root'> {}

export class RootContent extends ContentComponent implements Model<RootContentJson> {
    constructor(
        siblings?: Content[],
    ) {
        super('root', siblings);
    }

    static fromJson(info: RootContentJson): RootContent {
        return new RootContent(info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(): RootContent {
        return new RootContent();
    }

    json(): RootContentJson {
        return {
            type: 'root',
            siblings: this.siblings?.map(s => s.json()),
        };
    }
}

export interface TextContentJson extends ContentComponentJson<'text'> {
    text: string;
}

export class TextContent extends ContentComponent implements Model<TextContentJson> {
    constructor(
        public text: string,
        siblings?: Content[],
    ) {
        super('text', siblings);
    }

    static fromJson(info: TextContentJson): TextContent {
        return new TextContent(info.text, info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(text: string): TextContent {
        return new TextContent(text);
    }

    json(): TextContentJson {
        return {
            type: 'text',
            text: this.text,
            siblings: this.siblings?.map(s => s.json()),
        };
    }
}

export interface ImageContentJson extends ContentComponentJson<'image'> {
    url: string;
    id: string;
}

export class ImageContent extends ContentComponent implements Model<ImageContentJson> {
    constructor(
        public url: string,
        public id: string,
        siblings?: Content[],
    ) {
        super('image', siblings);
    }

    static fromJson(info: ImageContentJson): ImageContent {
        return new ImageContent(info.url, info.id, info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(url: string, id: string): ImageContent {
        return new ImageContent(url, id);
    }

    json(): ImageContentJson {
        return {
            type: 'image',
            url: this.url,
            id: this.id,
            siblings: this.siblings?.map(s => s.json()),
        };
    }
}
