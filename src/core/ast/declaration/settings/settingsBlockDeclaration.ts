import {BaseNode} from '../../base/baseNode';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Bundle} from './bundle';
import {Loc} from '../../../types/analysis';
import {ArrayExpression} from '../../base/arrayExpression';
import {Literal} from '../../base/literal';
import {Alias} from './alias';
import {ComplexValue} from './complexValue';
import {InheritanceDeclaration} from './inheritanceDeclaration';
import {Param} from './param';
import {Arg} from './arg';
import {IJsonSerializable} from '../../../types/common';
import * as Util from 'util';

/**
 * Represents a settings block declaration
 * e.g app "listen" 80
 */
export class SettingsBlockDeclaration extends BaseNode implements IJsonSerializable<any> {

    // block type + namespace
    private _bundle: Bundle;

    // block parents
    private _inheritFrom: InheritanceDeclaration;

    // sb alias
    private _alias: Alias;

    // sb value
    private _value: Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue>
        | ComplexValue;

    // init block properties with...
    private _initWith: Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue | Arg>;

    // block parameters
    private _params: ArrayExpression<Param>;


    constructor(loc: Loc) {
        super(loc);
    }

    public get bundle(): Bundle {
        return this._bundle;
    }

    public set bundle(value: Bundle) {
        this._bundle = value;
        this._bundle.parent = this;
    }

    public get inheritFrom(): InheritanceDeclaration {
        return this._inheritFrom;
    }

    public set inheritFrom(value: InheritanceDeclaration) {
        this._inheritFrom = value;
        this._inheritFrom.parent = this;
    }

    public get value(): Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue> | ComplexValue {
        return this._value;
    }

    public set value(value: Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue> | ComplexValue) {
        if (value instanceof ComplexValue) {
            for (let element of value.elements) {
                if (element.right instanceof SettingsBlockDeclaration) {
                    element.right.bundle.parentBundle = this.bundle;
                }
            }
        }
        this._value = value;
        this._value.parent = this;
    }

    public get alias(): Alias {
        return this._alias;
    }

    public set alias(value: Alias) {
        this._alias = value;
        if (value) {
            this._alias.parent = this;
        }
    }

    public get initWith(): Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue | Arg> {
        return this._initWith;
    }

    public set initWith(value: Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue | Arg>) {
        this._initWith = value;
        if (this._initWith) {
            this._initWith.parent = this;
        }
    }

    public get params(): ArrayExpression<Param> {
        return this._params;
    }

    public set params(value: ArrayExpression<Param>) {
        this._params = value;
        this._params.parent = this;
    }

    public get subSettingsBlocks(): Array<SettingsBlockDeclaration> {

        if (this._value instanceof ComplexValue) {
            return (<ComplexValue>this._value).elements.filter((element) => {
                return element.right instanceof SettingsBlockDeclaration;
            }).map((element) => {
                return <SettingsBlockDeclaration>element.right;
            });
        } else {
            return [];
        }

    }

    public toString(): string {
        let output = this.bundle.toString();

        if (this.alias) { // alias
            output += ' ' + this.alias.toString();
        }

        if (this.inheritFrom) {
            output += ' ' + this.inheritFrom.toString();
        }

        if (this.value) {
            output += ' ' + this.value.toString();
        }

        return output;
    }

    public toJson() {
        return this._value ? this._value.toJson() : {};
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.SettingsBlockDeclaration;
    }

    protected get iterableElements() {
        return [this.bundle, this.inheritFrom, this.alias, this.initWith, this.params, this.value];
    }
}