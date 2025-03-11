import {randomUUID} from 'node:crypto';
import {IDatabase} from "./Database";

export interface IDrives {
    getDrive: () => object;
}

export class Drives implements IDrives {
    private database: IDatabase;
    #instanceId: string

    constructor(database: IDatabase) {
        this.database = database;
        this.#instanceId = `drives-${randomUUID()}`;
    }

    getDrive = (): object => {
        return this.database.fetchRecord(this.#instanceId);
    }
}
