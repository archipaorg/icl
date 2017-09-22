import {BaseNode} from './baseNode';
import {ASTNodeKind} from '../../enums/astNodeKind';
import {Loc} from '../../types/analysis';
import {ASTNodeType} from '../../enums/astNodeType';
import {IJsonSerializable} from '../../types/common';

/**
 * Handle literal such as string, boolean, int
 */
export class Literal<T> extends BaseNode implements IJsonSerializable<T> {

    /**
     * The actual data hold by the node
     */
    private _data: T;

    constructor(loc: Loc, data: T, kind: ASTNodeKind = ASTNodeKind.None) {
        super(loc);
        this.kind = kind;
        this.data = data;
    }

    public get data(): T {
        return this._data;
    }

    public set data(value: T) {
        this._data = value;
    }

    public toJson() {
        return this._data;
    }

    public toString(): string {
        return Object.keys(this._data).length === 0
        && this._data.constructor === Object
            ? 'null' : this._data.toString();
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.Literal;
    }

    protected get iterableElements() {
        return [this];
    }

}