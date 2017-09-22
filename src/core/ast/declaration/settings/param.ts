import {Literal} from '../../base/literal';
import {ASTNodeType} from '../../../enums/astNodeType';

/**
 *
 * Represents a mixin param
 */
export class Param extends Literal<string> {


    public get name(): string {
        return this.data;
    }

    public isSetParam(): boolean {
        return this.data.startsWith('@@');
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockParam;
    }

}