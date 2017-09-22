import {BaseNode} from './baseNode';
import {ASTNodeType} from '../../enums/astNodeType';
import {Loc} from '../../types/analysis';

export class EOF extends BaseNode {

    constructor(loc: Loc) {
        super(loc);
    }

    public toString(): string {
        return '';
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.EOF;
    }

    protected get iterableElements() {
        return [];
    }

}