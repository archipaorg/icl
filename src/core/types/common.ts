export function using<T extends IDisposable>(resource: T, func: (resource: T) => void) {
    try {
        func(resource);
    } finally {
        resource.dispose();
    }
}

export interface IJsonSerializable<T> {
    toJson(): T;
}

export interface IDisposable {
    dispose(): void;
}