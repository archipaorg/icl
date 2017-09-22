import {
    IDisposable
} from '../../core/types/common';
import {ICacheableResource, ICacheResourceManager, IResource} from '../../core/types/resource';

/**
 * Manages ICLResources
 */
export class ResourceManager implements ICacheResourceManager<IResource<string> & ICacheableResource<IResource<string>> & IDisposable>, IDisposable {

    private _cache: Map<string, string> = new Map();
    private _resources: Array<IResource<string> & ICacheableResource<IResource<string>> & IDisposable> = [];

    public register(resource: IResource<string> & ICacheableResource<IResource<string>> & IDisposable): void {
        this._resources.push(resource);
    }

    public set(key: string, data: any): void {
        this._cache.set(key, data);
    }

    public get(key: string): any {
        return this._cache.get(key);
    }

    public delete(key: string): void {
        this._cache.delete(key);
    }

    public init(): void {
        this.dispose();
        this._cache.clear();
    }

    public getResourceByUri(uri: string): undefined | IResource<string> & ICacheableResource<IResource<string>> & IDisposable {
        for (let resource of this._resources) {
            if (resource.uri == uri) {
                return resource;
            }
        }
    }


    public dispose(): void {
        for (let resource of this._resources) {
            resource.dispose();
        }
        this._resources.length = 0;
    }
}