import {IDisposable} from '../../core/types/common';
import * as chokidar from 'chokidar';
import {FSWatcher as ChokiWatcher} from 'chokidar';
import {IWatchableResource, IWatcher} from '../../core/types/resource';

/**
 * Watch a group of {@see FsResource} and notify them when their associated file get updated
 */
export class FsWatcher implements IWatcher, IDisposable {

    private _watchedResources: { [key: string]: IWatchableResource };
    private _watcher: ChokiWatcher;

    constructor() {
        this._watchedResources = {};
    }

    public new(): FsWatcher {
        return new FsWatcher();
    }

    public watch(resource: IWatchableResource): void {
        if (!this._watcher) {
            this._watcher = chokidar.watch(resource.watchAt());
        } else {
            this._watcher.add(resource.watchAt());
        }
        this._watchedResources[resource.watchAt()] = resource;
    }

    public unwatch(resource: IWatchableResource): void {
        if (this._watcher) {
            this._watcher.unwatch(resource.watchAt());
        }
        delete this._watchedResources[resource.watchAt()];
    }

    dispose(): void {
        if (this._watcher) {
            this._watcher.close();
        }
    }

}