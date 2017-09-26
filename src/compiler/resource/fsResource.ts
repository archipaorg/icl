import {
    IDisposable
} from '../../core/types/common';
import {readFileSync, existsSync} from 'fs';
import * as Path from 'path';
import {ObjUtils} from '../../core/utils/objUtils';
import {
    ICacheableResource, ICacheResourceManager, IParseableResource, IResource, IWatchableResource,
    IWatcher
} from '../../core/types/resource';

/**
 * Manages an ICL resource associated with a file
 */
export class FsResource<L, T> implements IResource<L>, IWatchableResource, ICacheableResource<L>, IDisposable, IParseableResource<T> {

    /**
     * default icl configuration fileHash name extension
     * @const {string}
     */
    protected static DEFAULT_SETTINGS_FILENAME_EXT: string = '.icl';

    protected _uri: string;
    protected _searchIn: Array<string>;
    protected _description: string | undefined;
    protected _parent: IResource<L> | undefined;
    protected _cacheManager: ICacheResourceManager<IResource<L>>;
    protected _hasChanged: boolean;
    protected _parsedContent: T;
    protected _watcher: IWatcher;
    // indicate if we've already performed a uri resolution or not
    protected _resolvedUri: boolean;

    constructor(uri: string,
                parent?: IResource<L> & IWatchableResource & ICacheableResource<string> & IDisposable & IParseableResource<T>,
                searchIn: Array<string> = []) {
        this._uri = Path.extname(uri) ? uri : uri.concat(FsResource.DEFAULT_SETTINGS_FILENAME_EXT);
        this._searchIn = searchIn;
        this._parent = parent;
        this._hasChanged = true;
        this._resolvedUri = false;
        if (parent) { // by default an FsResource use the it's parent cache manager
            if (parent.cacheManager) {
                this.setCacheManager(parent.cacheManager);
            }
            if (parent.watcher) {
                this.setWatcher(parent.watcher);
            }
        }
        return this;
    }

    /**
     * returns resource location uri
     * @returns {string}
     */
    public get uri(): string {
        if (!this._resolvedUri) {

            let found = false;

            let retrievalAttempts = [this._parent && !Path.isAbsolute(this._uri) ? Path.join(Path.dirname(this._parent.uri), this._uri) : this._uri]
                .concat(this.searchIn.map((folder) => {
                    return Path.join(folder, this._uri);
                }));

            while (!found && retrievalAttempts.length > 0) {
                let retrievalAttempt = <string>retrievalAttempts.shift();
                if (existsSync(retrievalAttempt)) {
                    found = true;
                    this._resolvedUri = true;
                    this._uri = retrievalAttempt;
                }
            }

            if (!found) {
                let e: any = new Error('The file "' + this._uri + '" has not been found, search directories are [' + this._searchIn.join(', ') + ']');
                e.type = 'EUSAGE';
                throw e;
            }
        }
        return this._uri;
    }

    get parsedContent(): T {
        return this._parsedContent;
    }

    set parsedContent(value: T) {
        this._parsedContent = value;
    }

    /**
     * resource name
     * @returns {string}
     */
    public get name(): string {
        return Path.basename(this._uri);
    }

    public get description(): string | undefined {
        return this._description;
    }

    /**
     * resource parent
     * @returns {IResource}
     */
    public get parent(): IResource<L> | undefined {
        return this._parent;
    }

    public get isRoot(): boolean {
        return !!this._parent;
    }

    /**
     * hash resource content
     * @returns {string}
     */
    public get hash(): string {
        return ObjUtils.hash(this.content() ? this.content().toString() : '');
    }

    /**
     * return search in folders
     * @returns {Array<string>}
     */
    public get searchIn(): Array<string> {
        return this._searchIn;
    }

    /**
     * retrieve resource content either from cache or read it if it's content has changed
     * @returns {string}
     */
    public content(): L {
        if (this.getCachedValue() && !this.hasChanged) {
            return this.getCachedValue();
        } else {
            this.cacheManager.set(this.getCacheKey(), readFileSync(this.uri, {encoding: 'utf-8'}).toString());
            this._hasChanged = false;
            return this.getCachedValue();
        }
    }

    /**
     * read cache value
     * @Param {string} key
     * @returns {string}
     */
    public getCachedValue(): L {
        return this.cacheManager.get(this.getCacheKey());
    }

    /**
     * setCacheManager cache value
     * @Param {ICacheResourceManager} cacheManager
     */
    public setCacheManager(cacheManager: ICacheResourceManager<IResource<L>>) {
        this._cacheManager = cacheManager;
        this._cacheManager.register(this);
    }


    public get cacheManager(): ICacheResourceManager<IResource<L>> {
        this.checkCacheAndWatcherPresence();
        return this._cacheManager;
    }

    /**
     * indicate if the current resourc's content has changed or not
     * @returns {boolean}
     */
    public get hasChanged(): boolean {
        return this._hasChanged;
    }

    /**
     * this method is called by the watcher (IResourceManager)
     * the resource manager notifies the resource that it's content has changed
     */
    public setChanged(): void {
        this._hasChanged = true;
    }

    public get watcher(): IWatcher {
        this.checkCacheAndWatcherPresence();
        return this._watcher;
    }

    public setWatcher(watcher: IWatcher): void {
        this._watcher = watcher;
        if (this.exists()) {
            this._watcher.watch(this);
        }
    }

    public getCacheKey(): string {
        return this.uri;
    }

    public watchAt(): string {
        return this.uri;
    }

    public close(): void {
        // we don't need to close it in this case since readFile close it for us so we let this empty
    }

    public exists() {
        return existsSync(this.uri);
    }

    private checkCacheAndWatcherPresence() {
        if (!this._cacheManager) {
            throw new Error('The cache manager has not been set !');
        }
        if (!this._watcher) {
            throw new Error('The resource watcher has not been set !');
        }
    }

    public dispose(): void {
        // no resource to free in this case
        if (this._watcher && this._watcher) {
            this._watcher.unwatch(this);
        }
    }

}