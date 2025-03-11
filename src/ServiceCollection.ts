type Registration = {
    classType: Constructor<unknown>;
    dependencyClassTypes: Constructor<unknown>[]
}

export class ServiceCollection {
    #registrations: Registration[] = [];

    addSingleton<T extends ConstructorNoArgs<unknown>>(classType: T): ServiceCollection;
    addSingleton<T extends Constructor<unknown>>(classType: T, {params}: {
        params: Constructors<ConstructorParameters<T>>
    }): ServiceCollection;

    addSingleton<T extends Constructor<unknown>>(classType: T, {params = []}: {
        params?: Constructor<unknown>[]
    } = {}): ServiceCollection {
        this.#registrations.push({
            classType,
            dependencyClassTypes: [...params]
        });
        return this;
    }

    build = (): ServiceProvider => {
        return new ServiceProvider(this.#registrations);
    }
}

export class ServiceProvider {
    #registry: Map<Constructor<unknown>, Registration> = new Map();
    #instances: Map<Constructor<unknown>, unknown> = new Map();

    constructor(registrations: Registration[]) {
        for (const registration of registrations) {
            this.#registry.set(registration.classType, registration);
        }
    }

    getService = <T>(constructor: Constructor<T>): T => {
        const existingInstance = this.#instances.get(constructor);
        if (existingInstance != null) {
            return existingInstance as T;
        }

        const registration = this.#registry.get(constructor);
        if (registration === undefined) {
            throw new Error(`No registration found for type ${constructor.name}`)
        }

        const dependencies = registration.dependencyClassTypes.map(type => this.getService(type));
        const newInstance = new constructor(...dependencies);
        this.#instances.set(constructor, newInstance);
        return newInstance as T;
    }
}

export type Constructors<T extends any[]> = {
    [K in keyof T]: Constructor<T[K]>;
};

export type Constructor<T> = new (...args: any[]) => T;

export type ConstructorNoArgs<T> = new () => T;
