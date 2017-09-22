import {ASTNodeType} from '../../enums/astNodeType';
import {Literal} from './literal';
import {Loc} from '../../types/analysis';

export class Keyword extends Literal<string> {

    constructor(loc: Loc, keyword: string) {
        super(loc, keyword);
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.Keyword;
    }

}