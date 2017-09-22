export interface IResource<T> {
    // the uri of the resource
    readonly uri: string,
    // resource name
    readonly name: string,
    // resource
    description: string | undefined,
    // parent resource
    readonly parent: IResource<T> | undefined,
    // it it the root or a dependency?
    readonly isRoot: boolean,
    // cache manager
    cacheManager: ICacheResourceManager<IResource<T>>,
    // hashed content
    readonly hash: string,

    // getCachedValue resource content
    content(): T,

    // close the resource
    close(): void,

    exists(): boolean
}

export interface ICacheableResource<T> {

    getCacheKey(): string,

    getCachedValue(): T,

    setCacheManager(cacheManager: ICacheResourceManager<IResource<T>>): void;

    readonly hasChanged: boolean
}

export interface IParseableResource<T> {
    parsedContent: T
}

export interface IWatchableResource {
    readonly watcher: IWatcher,

    // alert the resource that his content has changed
    setChanged(): void,

    setWatcher(watcher: IWatcher): void,

    watchAt(): string
}

export interface IEditableResource<T> {
    setContent(newContent: T): void;
}

export interface IWatcher {
    watch(resource: IWatchableResource): void;

    unwatch(resource: IWatchableResource): void
}

export interface ICacheResourceManager<T> {
    set(key: string, data: any): any;

    get(key: string): any;

    delete(key: string): void;

    register(resource: T): void;

    getResourceByUri(uri: string): T | undefined ;

    init(): void;
}

