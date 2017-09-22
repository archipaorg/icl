import {Literal} from '../../base/literal';
import {Loc} from '../../../types/analysis';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Bundle} from './bundle';

export class Inheritance extends Literal<string> {

    constructor(loc: Loc, path: Array<string> | string) {
        if (Array.isArray(path)) {
            path = path.join('.');
        }
        super(loc, <string>path);
    }

    public isAlias(): boolean {
        return this.data.split('.').length === 1 && this.data.split('.')[0] != Bundle.ROOT_LEVEL_MARKER;
    }

    public getPath(): Array<string> {
        return this.data.split('.').map((element) => {
            return element.replace(Bundle.ROOT_LEVEL_MARKER, '');
        });
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockInheritance;
    }

}