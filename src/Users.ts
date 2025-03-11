import {randomUUID} from 'node:crypto';
import {IDatabase} from "./Database";

export interface IUsers {
    getUsers: () => object[];
}

export class Users implements IUsers {
    #database: IDatabase;
    #instanceId: string
    #fetchCount: number

    constructor(database: IDatabase, fetchCount: number) {
        this.#database = database;
        this.#instanceId = `users-${randomUUID()}`;
        this.#fetchCount = fetchCount;
    }

    getUsers = (): object[] => {
        return [...Array(this.#fetchCount)].map(() => this.#database.fetchRecord(this.#instanceId));
    }
}
