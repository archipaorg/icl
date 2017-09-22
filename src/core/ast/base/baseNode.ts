import {ASTNodeKind} from '../../enums/astNodeKind';
import {Loc} from '../../types/analysis';
import {ASTNodeType} from '../../enums/astNodeType';
import {ObjUtils} from '../../utils/objUtils';
import {HashUtils} from '../../utils/hashUtils';
import * as Util from 'util';

/**
 * @author Mahieddine CHERIF <mahied.cherif@gmail.com>
 * @description Basic abstract class node that all AST nodes must extend and implement
 */
export abstract class BaseNode implements IterableIterator<BaseNode | undefined> {

    /**
     * Indicate node's type {@see ASTNodeType} for more details
     */
    private _type: ASTNodeType;

    /**
     * Node's type but in human readable format (mainly for debug purposes)
     */
    private _typeLabel: string;

    /**
     * Indicate node's kind {@see ASTNodeKind} for more details
     * This is much like a subtype
     */
    private _kind: ASTNodeKind;

    /**
     * Indicate node's kind but in human readable format (mainly for debug purposes)
     */
    private _kindLabel: string;

    /**
     * current iterator index
     */
    private pointer: number;

    /**
     * Indicate precisely where this node has been declared {@see Loc} for more details
     */
    private _loc: Loc;

    /**
     * Indicate node's parent
     */
    private _parent: BaseNode;

    protected _id: string;


    constructor(loc: Loc) {
        this._type = this.getType();
        this._typeLabel = ASTNodeType[this._type];
        this._kind = this.getKind();
        this._kindLabel = ASTNodeKind[this._kind];
        this._loc = loc;
        this.pointer = 0;
        this._id = this.generateID();
    }

    /**
     * Returns the node's type, be aware that the type property can only be setCacheManager one time
     * at construction time by calling the abstract {@see getType} method which must return the appropriate type
     * @returns {ASTNodeType}
     */
    public get type(): ASTNodeType {
        return this._type;
    }

    /**
     * Returns the grammar analysis.ts loc (file location, start line, start col, end line, end col)
     * {@see Loc} for more information, other than this same thing here can only be setCacheManager at construction time
     * @returns {Loc}
     */
    public get loc(): Loc {
        return this._loc;
    }

    /**
     * returns current node's kind (which is like a sub type)
     * @returns {ASTNodeKind}
     */
    public get kind(): ASTNodeKind {
        return this._kind;
    }

    /**
     * setCacheManager current node kind
     * @Param {ASTNodeKind} kind
     */
    public set kind(kind: ASTNodeKind) {
        this._kind = kind;
        this._kindLabel = ASTNodeKind[this._kind];
    }

    public get parent(): BaseNode {
        return this._parent;
    }

    public set parent(value: BaseNode) {
        this._parent = value;
    }

    public get id() {
        return this._id;
    }

    /**
     * called only one time during instance creation
     * @returns {string}
     */
    protected abstract getType(): ASTNodeType;

    /**
     * called only one time during instance creation
     * @returns {ASTNodeKind}
     */
    protected getKind(): ASTNodeKind {
        return ASTNodeKind.None;
    }

    protected generateID(): string {
        return Util.format('@(*%s*)(*%s*-*%s* to evaluate)', ASTNodeType[this.getType()],
            ASTNodeKind[this.getKind()], HashUtils.guid());
    }

    /**
     * Helper method to build loc object {@see Loc}
     * @Param {string} fileURI the complete file URI where the settings block is
     * @Param {string} fileHash the source file content hash
     * @Param {number} firstCol
     * @Param {number} firstLine
     * @Param {number} lastCol
     * @Param {number} lastLine
     * @returns {Loc}
     * @constructor
     */
    public static BuildContextWith(fileURI: string, fileHash: string, firstCol: number,
                                   firstLine: number, lastCol: number, lastLine: number) {
        return <Loc> {
            file_uri: fileURI,
            file_hash: fileHash,
            first_line: firstLine,
            first_column: firstCol,
            last_line: lastLine,
            last_column: lastCol
        };
    }

    public next(): IteratorResult<BaseNode | undefined> {
        if (this.pointer < this.iterableElements.length) {
            return {
                done: false,
                value: this.iterableElements[this.pointer++]
            }
        } else {
            return {
                done: true,
                value: undefined
            }
        }
    }

    [Symbol.iterator](): IterableIterator<BaseNode | undefined> {
        this.pointer = 0;
        return this;
    }

    public get hash() {
        return ObjUtils.hash(this.toString());
    }

    /**
     * returns the text representation of the current node
     * @returns {string}
     */
    public abstract toString(): string;

    /**
     * return the list of elements contained in the current node
     * @returns {Array<BaseNode>}
     */
    protected abstract get iterableElements(): Array<BaseNode>;

}