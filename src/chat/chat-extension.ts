import type { Client, Extension, Table } from '@omuchat/omu.js';
import { ExtensionInfo, ModelTableType, TableExtensionType, defineExtensionType } from '@omuchat/omu.js';

import { Author, Channel, Message, Provider, Room } from '../models';

export const ChatExtensionType = defineExtensionType({
    info: ExtensionInfo.create('chat'),
    create: (client: Client) => new ChatExtension(client),
    dependencies: () => [TableExtensionType],
});
const MessagesTableKey = ModelTableType.ofExtension(ChatExtensionType, {
    name: 'messages', model: Message,
});
const AuthorsTableKey = ModelTableType.ofExtension(ChatExtensionType, {
    name: 'authors', model: Author,
});
const ChannelsTableKey = ModelTableType.ofExtension(ChatExtensionType, {
    name: 'channels', model: Channel,
});
const ProvidersTableKey = ModelTableType.ofExtension(ChatExtensionType, {
    name: 'providers', model: Provider,
});
const RoomsTableKey = ModelTableType.ofExtension(ChatExtensionType, {
    name: 'rooms', model: Room,
});

export class ChatExtension implements Extension {
    messages: Table<Message>;
    authors: Table<Author>;
    channels: Table<Channel>;
    providers: Table<Provider>;
    rooms: Table<Room>;

    constructor(client: Client) {
        const tables = client.extensions.get(TableExtensionType);
        this.messages = tables.get(MessagesTableKey);
        this.authors = tables.get(AuthorsTableKey);
        this.channels = tables.get(ChannelsTableKey);
        this.providers = tables.get(ProvidersTableKey);
        this.rooms = tables.get(RoomsTableKey);
        this.messages.setCacheSize(10);
        this.authors.setCacheSize(10);
    }
}
