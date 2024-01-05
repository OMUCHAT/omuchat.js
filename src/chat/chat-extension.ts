import type { Client } from '@omuchat/omu.js';
import { SerializeEndpointType } from '@omuchat/omu.js/extension/endpoint/endpoint.js';
import type { Extension } from '@omuchat/omu.js/extension/extension.js';
import { defineExtensionType } from '@omuchat/omu.js/extension/extension.js';
import { TableExtensionType } from '@omuchat/omu.js/extension/table/table-extension.js';
import { ModelTableType, type Table } from '@omuchat/omu.js/extension/table/table.js';
import { Serializer } from '@omuchat/omu.js/interface/serializable.js';

import { Author, Channel, Message, Provider, Room } from '../models/index.js';

export class ChatExtension implements Extension {
    messages: Table<Message>;
    authors: Table<Author>;
    channels: Table<Channel>;
    providers: Table<Provider>;
    rooms: Table<Room>;

    constructor(private readonly client: Client) {
        const tables = client.extensions.get(TableExtensionType);
        this.messages = tables.get(MessagesTableKey);
        this.authors = tables.get(AuthorsTableKey);
        this.channels = tables.get(ChannelsTableKey);
        this.providers = tables.get(ProvidersTableKey);
        this.rooms = tables.get(RoomsTableKey);
        this.messages.setCacheSize(10);
        this.authors.setCacheSize(10);
    }

    async createChannelTree(provider: string): Promise<Channel[]> {
        return await this.client.endpoints.call(CreateChannelTreeEndpoint, provider);
    }
}

export const ChatExtensionType = defineExtensionType('chat', {
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

const CreateChannelTreeEndpoint = SerializeEndpointType.ofExtension(ChatExtensionType, {
    name: 'create_channel_tree',
    requestSerializer: Serializer.noop(),
    responseSerializer: Serializer.array(Serializer.model(Channel)),
});
