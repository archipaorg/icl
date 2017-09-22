import {BaseNode} from '../../base/baseNode';
import {ASTNodeType} from '../../../enums/astNodeType';
import {Keyword} from '../../base/keyword';
import {ArrayExpression} from '../../base/arrayExpression';
import {Dependency} from './dependency';
import {Loc} from '../../../types/analysis';
import {IJsonSerializable} from '../../../types/common';
import * as Util from 'util';

/**
 * Represents an import declaration such as : take file1, file2...
 *
 *              ImportDeclaration
 *                      |
 *                      |
 *            |-------- + --------|
 *            |                   |
 *            v                   v
 *         Keyword       ArrayExpression<Dependency>
 */
export class ImportDeclaration extends BaseNode implements IJsonSerializable<Array<string>> {

    /**
     * the identifier is the "take" keyword part which is an identifier
     */
    private _keyword: Keyword;

    /**
     * The list of importedFiles to be imported
     */
    private _importedFiles: ArrayExpression<Dependency>;


    constructor(loc: Loc, keyword: Keyword, importedFiles: ArrayExpression<Dependency>) {
        super(loc);
        this._keyword = keyword;
        this._importedFiles = importedFiles;
        this._keyword.parent = this._importedFiles.parent = this;
    }

    public get keyword(): Keyword {
        return this._keyword;
    }

    public get importedFiles(): ArrayExpression<Dependency> {
        return this._importedFiles;
    }

    /**
     * Add a file in the import list
     * @Param {Dependency} file
     */
    public importFile(file: Dependency) {
        this._importedFiles.addElement(file);
    }

    /**
     * Add a list of importedFiles to be imported
     * @Param files
     */
    public importFiles(files: Array<Dependency>) {
        this._importedFiles.addElements(files);
    }

    public toString(): string {
        return Util.format('%s %s', this.keyword.toString(),
            this.importedFiles.elements.map((element) => {
                return element.toString();
            }).join(', '));
    }

    public toJson(): string[] {
        let arr: Array<string> = [];
        for (let importFile of this.importedFiles.elements) {
            arr.push(importFile.toJson());
        }
        return arr;
    }

    protected getType(): ASTNodeType {
        return ASTNodeType.ImportDeclaration;
    }

    protected get iterableElements() {
        return [this.keyword, this.importedFiles];
    }

}