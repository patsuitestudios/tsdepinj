type ClassDependency = {
    name: 'class',
    classType: Constructor<unknown>
}

type ValueDependency = {
    name: 'value',
    value: unknown;
}

type Dependency = ClassDependency | ValueDependency;

type Registration = {
    classType: Constructor<unknown>;
    dependencies: Dependency[]
}

export class ServiceCollection {
    #registrations: Registration[] = [];

    addSingleton<T extends ConstructorNoArgs<unknown>>(classType: T): ServiceCollection;
    addSingleton<T extends Constructor<unknown>>(classType: T, {params}: {
        params: Constructors<ConstructorParameters<T>>
    }): ServiceCollection;

    addSingleton<T extends Constructor<unknown>>(classType: T, {params = []}: {
        params?: unknown[]
    } = {}): ServiceCollection {
        const dependencies: Dependency[] = [];
        for (const param of params) {
            const isConstructor = typeof param === 'function'; // TODO: better constructor
            if (isConstructor) {
                dependencies.push({
                    name: 'class',
                    classType: param as Constructor<unknown>
                })
            } else {
                dependencies.push({
                    name: 'value',
                    value: param
                })
            }
        }

        this.#registrations.push({classType, dependencies});
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

        const dependencies: unknown[] = [];
        for (const dependency of registration.dependencies) {
            if (dependency.name === 'value') {
                dependencies.push(dependency.value)
            } else {
                dependencies.push(this.getService(dependency.classType));
            }
        }

        const newInstance = new constructor(...dependencies);
        this.#instances.set(constructor, newInstance);
        return newInstance as T;
    }
}

export type Constructors<T extends any[]> = {
    [K in keyof T]: T[K] extends object ? Constructor<T[K]> : T[K];
};

export type Constructor<T> = new (...args: any[]) => T;

export type ConstructorNoArgs<T> = new () => T;
