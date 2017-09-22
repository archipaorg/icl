import {ASTNodeType} from '../../../enums/astNodeType';
import {ArrayExpression} from '../../base/arrayExpression';
import {PropertyDeclarator} from './propertyDeclarator';
import * as extend from 'extend';
import * as Util from 'util';

/**
 * Represents a complex value (comparable to a map)
 *
 *                 ComplexValue
 *                      |
 *                      |
 *            |-------- + --------|
 *            |                   |
 *            v                   v
 *         PropertyDeclarator 1       PropertyDeclarator 2....
 */
export class ComplexValue extends ArrayExpression<PropertyDeclarator> {

    public addElement(element: PropertyDeclarator) {
        super.addElement(element);
        return this;
    }

    public addElements(elements: Array<PropertyDeclarator>) {
        super.addElements(elements);
        return this;
    }

    public toString() {
        return Util.format('{\r\n' +
            this.elements.map((element) => {
                return '    ' + element.toString()
            }).join(',\r\n') +
            '\r\n}')
    }

    public toJson() {
        let obj: any = {};
        for (let element of this.elements) {
            obj = extend(obj, element.toJson(), true);
        }
        return obj;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockComplexValue;
    }

}