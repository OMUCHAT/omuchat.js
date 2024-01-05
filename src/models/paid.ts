import type { Model } from '@omuchat/omu.js/interface/index.js';

export interface PaidJson {
    amount: number;
    currency: string;
}

export class Paid implements Model<PaidJson> {
    amount: number;
    currency: string;

    constructor(options: {
        amount: number;
        currency: string;
    }) {
        this.amount = options.amount;
        this.currency = options.currency;
    }

    static fromJson(info: PaidJson): Paid {
        return new Paid({
            amount: info.amount,
            currency: info.currency,
        });
    }

    toJson(): PaidJson {
        return {
            amount: this.amount,
            currency: this.currency,
        };
    }

    toString(): string {
        return `${this.amount} ${this.currency}`;
    }
}
