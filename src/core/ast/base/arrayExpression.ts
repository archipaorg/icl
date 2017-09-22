import {BaseNode} from './baseNode';
import {ASTNodeKind} from '../../enums/astNodeKind';
import {Loc} from '../../types/analysis';
import {ASTNodeType} from '../../enums/astNodeType';
import {IJsonSerializable} from '../../types/common';

/**
 * Express a list of generic elements
 */
export class ArrayExpression<T extends BaseNode> extends BaseNode implements IJsonSerializable<Array<any>> {

    private _elements: Array<T> = [];

    constructor(loc: Loc) {
        super(loc);
    }

    /**
     * add Element
     * @Param {T} element
     * @returns {ArrayExpression<T>}
     */
    public addElement(element: T, atStart: boolean = false) {
        element.parent = this;
        if (atStart) {
            this._elements.unshift(element);
        } else {
            this._elements.push(element);
        }
        return this;
    }

    /**
     * add a bunch of elements
     * @Param {Array<T>} elements
     * @returns {ArrayExpression<T>}
     */
    public addElements(elements: Array<T>, atStart: boolean = false) {
        for (let element of elements) {
            this.addElement(element, atStart);
        }
        return this;
    }

    public get elements(): Array<T> {
        return this._elements;
    }

    public toString(): string {
        return this.elements.map((element) => {
            return element.toString();
        }).join(', ');
    }

    public toJson(): Array<any> {
        let obj: Array<any> = [];
        this._elements.forEach((element) => {
            let serializedElement = (<any>element).toJson();
            if (serializedElement)
                obj.push((<any>element).toJson());
        });
        return obj;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.ArrayExpression;
    }

    protected getKind(): ASTNodeKind {
        return ASTNodeKind.None;
    }

    protected get iterableElements(): Array<BaseNode> {
        return this.elements;
    }

}