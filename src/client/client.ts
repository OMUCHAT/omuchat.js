import * as omu from '@omuchat/omu.js';
import type { TokenProvider } from '@omuchat/omu.js/client/token.js';
import type { Address } from '@omuchat/omu.js/connection/index.js';

import type { ChatExtension } from '../chat/index.js';
import { ChatExtensionType } from '../chat/index.js';
import type { EventHandler, EventKey } from '../event/index.js';
import { EventRegistry } from '../event/index.js';

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
        token,
    }: {
        app: omu.App;
        address?: Address;
        client?: omu.Client;
        token?: TokenProvider;
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
            token: token ?? new BrowserTokenProvider('omu-token'),
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

class BrowserTokenProvider implements TokenProvider {
    constructor(
        private readonly key: string,
    ) {}

    async get(): Promise<string | null> {
        return localStorage.getItem(this.key);
    }

    async set(token: string): Promise<void> {
        localStorage.setItem(this.key, token);
    }
}
