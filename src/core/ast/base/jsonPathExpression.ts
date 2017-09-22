import {Literal} from './literal';
import {Hash, LexYaccError, Loc} from '../../types/analysis';
import {ASTNodeType} from '../../enums/astNodeType';
import {ObjUtils} from '../../utils/objUtils';
import {HashUtils} from '../../utils/hashUtils';
import {IJsonSerializable} from '../../../core/types/common';
import * as Util from 'util';

export class JSONPathExpression extends Literal<any> {

    private _expression: string;

    constructor(loc: Loc, expression: string) {
        super(loc, expression);
        this._expression = expression;
    }

    public get expression(): string {
        return this._expression;
    }

    public set expression(value: string) {
        this._expression = value;
    }

    /**
     * evaluate the current defined json path expression
     * and save the expression in the data field
     * @param obj
     */
    public eval(obj: any) {
        this.data = (<IJsonSerializable<any>>ObjUtils.getMultilevelProperty(obj, this.expression));
        if (!this.data) {
            throw <LexYaccError>{
                hash: <Hash>{
                    line: this.loc.first_line,
                    loc: <Loc>{
                        file_uri: this.loc.file_uri,
                        file_hash: this.loc.file_hash,
                        first_line: this.loc.first_line,
                        first_column: this.loc.first_column,
                        last_column: this.loc.last_column,
                        last_line: this.loc.last_line
                    }
                },
                message: Util.format('The expression can\'t be evaluated because "%s" doesn\'t exists "%s", line %s, col %s',
                    this.expression,
                    this.loc.file_uri,
                    this.loc.first_line,
                    this.loc.first_column
                )
            };
        }
    }

    public toJson() {
        // if the expression has not been evaluated yet we return a (/*guid*/(toEvaluate))
        return this._expression === this.data ? this._id : super.toJson();
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.JSONPathExpression;
    }

    protected generateID(): string {
        return Util.format('@(*%s*)(JSPathExpr to evaluate)', HashUtils.guid());
    }

}