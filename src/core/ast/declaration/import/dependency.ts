import {Loc} from '../../../types/analysis';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Literal} from '../../base/literal';

/**
 * Handle import declaration such as : take file1, file2...
 */
export class Dependency extends Literal<string> {

    constructor(loc: Loc, file: string) {
        super(loc, file);
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.ImportFile;
    }
}