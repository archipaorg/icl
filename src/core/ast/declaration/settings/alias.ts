import {ASTNodeType} from '../../../enums/astNodeType';
import {BinaryExpression} from '../../base/binaryExpression';
import {Identifier} from '../../base/identifier';
import {Keyword} from '../../base/keyword';
import {Loc} from '../../../types/analysis';
import {ASTNodeKind} from '../../../enums/astNodeKind';
import * as Util from 'util';

/**
 * Represents a settings block alias declaration such as : "as WebApp"...
 *
 *              AliasDeclaration
 *                      |
 *                      |
 *            |-------- + --------|
 *            |                   |
 *            v                   v
 *         Keyword (as)      Identifier
 */
export class Alias extends BinaryExpression<Keyword, Identifier> {

    constructor(loc: Loc, keyword: Keyword, identifier: Identifier) {
        super(loc, keyword, identifier);
        this.identifier.kind = ASTNodeKind.AliasDefinition;
    }

    public get identifier(): Identifier {
        return this.right;
    }


    public get keyword(): Keyword {
        return this.left;
    }

    public toString(): string {
        return Util.format('%s %s', this.keyword.toString(), this.identifier.toString());
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockAlias;
    }

}