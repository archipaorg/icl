import {ASTNodeType} from '../../enums/astNodeType';
import {Loc} from '../../types/analysis';
import {Literal} from './literal';

export class Identifier extends Literal<string> {

    constructor(loc: Loc, identifier: string) {
        super(loc, identifier);
    }

    public get name(): string {
        return this.data;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.Identifier;
    }

}