import {ArrayExpression} from '../../base/arrayExpression';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Loc} from '../../../types/analysis';
import {BinaryExpression} from '../../base/binaryExpression';
import {Keyword} from '../../base/keyword';
import {Inheritance} from './inheritance';
import * as Util from 'util';

/**
 *
 * Represents a settings block's inheritance
 *
 *                 InheritanceDeclaration
 *                     |
 *                     |
 *            |------- + -------+
 *            |                 |
 *            v                 v
 *        Keyword    ArrayExpression of Inheritance<Literal<string>> (parent's location)
 *
 */
export class InheritanceDeclaration extends BinaryExpression<Keyword, ArrayExpression<Inheritance>> {

    constructor(loc: Loc, keyword: Keyword, inheritance: ArrayExpression<Inheritance>) {
        super(loc, keyword, inheritance);
    }

    public addInheritance(dependency: Inheritance) {
        this.inheritances.addElement(dependency);
    }

    public get inheritances(): ArrayExpression<Inheritance> {
        return this.right;
    }

    public toString(): string {
        return Util.format('%s %s', this.left.toString(), this.inheritances.elements.map((element) => {
            return element.toString();
        }).join('.'));
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockInheritance;
    }

}