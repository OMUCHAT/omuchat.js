import * as omu from '@omuchat/omu.js';
import type { Address } from '@omuchat/omu.js/src/connection';

import type { ChatExtension } from '../chat';
import { ChatExtensionType } from '../chat';
import type { EventHandler, EventKey } from '../event';
import { EventRegistry } from '../event';

export class Client {
    app: omu.App;
    address: Address;
    omu: omu.Client;
    chat: ChatExtension;
    eventRegistry: EventRegistry;

    constructor({
        app,
        address,
        client,
    }: {
        app: omu.App;
        address?: Address;
        client?: omu.Client;
    }) {
        this.app = app;
        this.address = address || {
            host: '127.0.0.1',
            port: 26423,
            secure: false,
        };
        this.omu = client || new omu.OmuClient({
            app,
            address: this.address,
        });
        this.eventRegistry = new EventRegistry(this);
        this.chat = this.omu.extensions.register(ChatExtensionType);
    }

    run(): void {
        this.omu.start();
    }

    on<T extends unknown[]>(event: EventKey<T>, handler: EventHandler<T>): void {
        this.eventRegistry.on(event, handler);
    }
}
