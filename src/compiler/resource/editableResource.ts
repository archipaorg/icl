import {FsResource} from './fsResource';
import {
    IDisposable
} from '../../core/types/common';
import {
    ICacheableResource, IEditableResource, IParseableResource, IResource,
    IWatchableResource
} from '../../core/types/resource';
import {readFileSync, existsSync} from 'fs';
import * as Path from 'path';

/**
 * An editable resource represents a resource that is opened in an editor for example
 * and is being edited, the logic is that this type of "resource" doesn't have to have a physical file representation,
 * plus even if it has an associated file, it's content can be updated but nonetheless not saved
 * therefore the content is always loaded from the cache
 * This class is usefull when you want to implement an IDE extension for ICL for example
 */
export class EditableResource<L, T> extends FsResource<L, T> implements IEditableResource<L> {
    // turning this Param to false will make editableResource behave like a normal resource
    public loadOnlyFromCache: boolean;

    constructor(uri: string,
                parent?: IResource<L> & IWatchableResource & ICacheableResource<string> & IDisposable & IParseableResource<T>) {
        super(uri, parent);
        this.loadOnlyFromCache = true;
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
        }
        return this._uri;
    }

    /**
     * write directly into the cache
     * @Param {L} newContent
     */
    public setContent(newContent: L): void {
        let content: L = this.getCachedValue();
        if (content != newContent) {
            this.cacheManager.set(this.uri, newContent);
            this.setChanged();
        }
    }

    public content(): L {
        return this.loadOnlyFromCache ? this.getCachedValue() : super.content();
    }

}