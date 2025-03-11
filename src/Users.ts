import {randomUUID} from 'node:crypto';
import {IDatabase} from "./Database";

export interface IUsers {
    getUser: () => object;
}

export class Users implements IUsers {
    private database: IDatabase;
    #instanceId: string

    constructor(database: IDatabase) {
        this.database = database;
        this.#instanceId = `users-${randomUUID()}`;
    }

    getUser = (): object => {
        return this.database.fetchRecord(this.#instanceId);
    }
}
