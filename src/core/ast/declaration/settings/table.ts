import {ArrayExpression} from '../../base/arrayExpression';
import {Arg} from './arg';
import {ASTNodeType} from '../../../enums/astNodeType';
import {BinaryExpression} from '../../base/binaryExpression';
import {Keyword} from '../../base/keyword';
import {IJsonSerializable} from '../../../types/common';
import * as Util from 'util';

/**
 * represents a table of values
 */
export class Table extends BinaryExpression<Keyword, ArrayExpression<Arg>> implements IJsonSerializable<any> {

    public toString() {
        return Util.format('%s %s', this.left.toString(), this.right.elements.map((element) => {
            return element.toString();
        }).join(',\r\n'));
    }

    public toJson() {
        let obj: any = {};
        for (let arg of this.right.elements) {
            obj[arg.param.name] = arg.value.toJson();
        }
        return obj;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.Table;
    }

}