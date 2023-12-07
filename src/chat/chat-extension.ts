import type { Client, ClientListener, Extension, ExtensionType, Table } from '@omuchat/omu.js';
import { ExtensionInfo, ModelTableType, Serializer, TableExtensionType, TableInfo, defineExtensionType } from '@omuchat/omu.js';

import type { ChannelJson, MessageJson, ProviderJson, RoomJson } from '../models';
import { Channel, Message, Provider, Room } from '../models';

export const ChatExtensionType: ExtensionType<ChatExtension> = defineExtensionType(ExtensionInfo.create('chat'), (client: Client) => new ChatExtension(client), () => [TableExtensionType]);
const MessagesTableKey = new ModelTableType<Message, MessageJson>(TableInfo.create(ChatExtensionType, 'messages').setUseDatabase(true), Serializer.model(Message.fromJson));
const ChannelsTableKey = new ModelTableType<Channel, ChannelJson>(TableInfo.create(ChatExtensionType, 'channels'), Serializer.model(Channel.fromJson));
const ProvidersTableKey = new ModelTableType<Provider, ProviderJson>(TableInfo.create(ChatExtensionType, 'providers'), Serializer.model(Provider.fromJson));
const RoomsTableKey = new ModelTableType<Room, RoomJson>(TableInfo.create(ChatExtensionType, 'rooms'), Serializer.model(Room.fromJson));

export class ChatExtension implements Extension, ClientListener {
    messages: Table<Message>;
    channels: Table<Channel>;
    providers: Table<Provider>;
    rooms: Table<Room>;

    constructor(private readonly client: Client) {
        client.addListener(this);
        const tables = client.extensions.get(TableExtensionType);
        this.messages = tables.register(MessagesTableKey);
        this.channels = tables.register(ChannelsTableKey);
        this.providers = tables.register(ProvidersTableKey);
        this.rooms = tables.register(RoomsTableKey);
    }

    onInitialized(): void {
    }
}
