import {BaseNode} from './baseNode';
import {Loc} from '../../types/analysis';

/**
 * Express a list of generic elements
 */
export abstract class BinaryExpression<A extends BaseNode, B extends BaseNode> extends BaseNode {

    private _left: A;
    private _right: B;


    constructor(loc: Loc, left: A, right: B) {
        super(loc);
        left.parent = right.parent = this;
        this._left = left;
        this._right = right;
    }

    public get left(): A {
        return this._left;
    }

    public get right(): B {
        return this._right;
    }

    protected get iterableElements() {
        return [this.left, this.right];
    }

}