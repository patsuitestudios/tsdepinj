import {randomUUID} from 'node:crypto';

export interface IDatabase {
    fetchRecord: (id: string) => object;
}

export class Database implements IDatabase {
    #instanceId: string

    constructor() {
        this.#instanceId = `database-${randomUUID()}`;
    }

    fetchRecord = (id: string): object => ({
        id,
        database: this.#instanceId
    })
}
