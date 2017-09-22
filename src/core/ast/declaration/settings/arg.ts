import {BinaryExpression} from '../../base/binaryExpression';
import {Literal} from '../../base/literal';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Param} from './param';
import {IJsonSerializable} from '../../../types/common';
import {JSONPathExpression} from '../../base/jsonPathExpression';
import * as Util from 'util';

export class Arg extends BinaryExpression<Param, Literal<string | number | boolean>
    | JSONPathExpression> implements IJsonSerializable<any> {


    public get param(): Param {
        return this.left;
    }

    public get value(): Literal<string | number | boolean> | JSONPathExpression {
        return this.right;
    }

    public toString() {
        return Util.format('%s = %s', this.param.toString(), this.value.toString());
    }

    public toJson() {
        return;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockArg;
    }

}