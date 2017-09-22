import {ASTNodeKind} from '../../../enums/astNodeKind';
import {Identifier} from '../../base/identifier';
import {Loc} from '../../../types/analysis';
import {BaseNode} from '../../base/baseNode';
import {ArrayExpression} from '../../base/arrayExpression';
import {Literal} from '../../base/literal';
import {ASTNodeType} from '../../../enums/astNodeType';
import * as Util from 'util';

/**
 * Represents a settings block's bundle
 *
 *                   Bundle
 *                     |
 *                     |
 *            |------- + -------+
 *            |                 |
 *            v                 v
 *     Identifier(kind:Type) Namespace (ArrayExpression)
 *
 */
export class Bundle extends BaseNode {

    // all bundle identifier that starts with this are considered like "libraries"
    private static readonly LIB_MARKER = '::';
    public static readonly ROOT_LEVEL_MARKER = '_';

    // settings block identifier (type)
    private readonly _identifier: Identifier;
    // settings block namespace
    private readonly _namespace: ArrayExpression<Literal<string>>;
    // parent namespace
    private _parentBundle: Bundle;

    constructor(loc: Loc, identifier: Identifier, namespace: ArrayExpression<Literal<string>>) {
        super(loc);
        this._identifier = identifier;
        this._namespace = namespace;
        this._identifier.parent = this._namespace.parent = this;
        this._identifier.kind = ASTNodeKind.Type;
        this._namespace.kind = ASTNodeKind.Namespace;
    }

    public get identifier(): Identifier {
        return this._identifier;
    }

    public get namespace(): ArrayExpression<Literal<string>> {
        return this._namespace;
    }

    public get parentBundle(): Bundle {
        return this._parentBundle;
    }

    public set parentBundle(value: Bundle) {
        this._parentBundle = value;
        this._parentBundle.parent = this;
    }

    /**
     * indicate if it's a library
     * @returns {boolean}
     */
    public get isLib(): boolean {
        return this._identifier.data.startsWith(Bundle.LIB_MARKER);
    }

    public getJSONRelativePath(dotnotated: boolean = false, parentPath?: Array<string>): Array<string> | string {

        let fullPath: Array<string> = parentPath || [];

        if (this.identifier.name && this.identifier.kind !== ASTNodeKind.Alias && this.identifier.name != Bundle.ROOT_LEVEL_MARKER) {
            fullPath.push(this.identifier.name.replace(Bundle.LIB_MARKER, ''));
        }

        this.namespace.elements.forEach((element) => {
            if (element.data != Bundle.ROOT_LEVEL_MARKER) {
                fullPath.push(element.data);
            }
        });

        return dotnotated ? fullPath.join('.') : fullPath;

    }

    public getJSONFullPath(dotnotated: boolean = false): Array<string> | string {

        let parentPath: Array<string> = this._parentBundle ? <Array<string>>this._parentBundle.getJSONRelativePath() : [];

        return this.getJSONRelativePath(dotnotated, parentPath);

    }

    public toString(): string {
        return Util.format('%s %s', this.identifier.toString(), this.namespace.elements.map((element) => {
            return '"' + element.toString() + '"';
        }).join(' '));
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockBundle;
    }

    protected get iterableElements() {
        return [this.identifier, this.namespace];
    }

}