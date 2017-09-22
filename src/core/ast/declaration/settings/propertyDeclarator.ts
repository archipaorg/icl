import {BinaryExpression} from '../../base/binaryExpression';
import {Literal} from '../../base/literal';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Loc} from '../../../types/analysis';
import {Identifier} from '../../base/identifier';
import {SettingsBlockDeclaration} from './settingsBlockDeclaration';
import {ObjUtils} from '../../../utils/objUtils';
import {ComplexValue} from './complexValue';
import {IJsonSerializable} from '../../../types/common';
import {ASTNodeKind} from '../../../enums/astNodeKind';
import {JSONPathExpression} from '../../../ast/base/jsonPathExpression';
import {ArrayExpression} from '../../../ast/base/arrayExpression';
import * as Util from 'util';


/**
 *
 * Represents a property declarator
 *
 *               PropertyDeclarator
 *                     |
 *                     |
 *            |------- + -------+
 *            |                 |
 *            v                 v
 *       Identifier  Value of type Identifier | Literal | ComplexValue | SettingsBlockDeclaration
 *
 */
export class PropertyDeclarator extends BinaryExpression<Identifier, Literal<any> | JSONPathExpression
    | ComplexValue | SettingsBlockDeclaration> implements IJsonSerializable<any> {

    constructor(loc: Loc, identifier: Identifier, value: Literal<any>) {
        super(loc, identifier, value);
        this.left.kind = ASTNodeKind.Property;
    }

    public get identifier(): Identifier {
        return this.left;
    }

    public toString(): string {
        return this.right instanceof SettingsBlockDeclaration
            ? Util.format('%s = %s', (<SettingsBlockDeclaration>this.right).bundle.getJSONRelativePath(true), this.right.toString())
            : Util.format('%s = %s', this.identifier.toString(), this.right ? this.right.toString() : '');
    }

    public toJson() {
        let obj: any = {};
        if (this.right instanceof Literal || this.right instanceof ComplexValue || this.right instanceof ArrayExpression) {
            obj[this.left.name] = this.right.toJson();
        } else if (this.right instanceof SettingsBlockDeclaration) {
            ObjUtils.createMultilevelProperty(obj, (<SettingsBlockDeclaration>this.right).bundle.getJSONRelativePath(),
                (<SettingsBlockDeclaration>this.right).toJson());
        }
        return obj;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockPropertyDeclarator;
    }

}