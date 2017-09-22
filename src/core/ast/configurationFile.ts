import {ASTNodeKind} from '../enums/astNodeKind';
import {ArrayExpression} from './base/arrayExpression';
import {ImportDeclaration} from './declaration/import/importDeclaration';
import {Loc} from '../types/analysis';
import {SettingsBlockDeclaration} from './declaration/settings/settingsBlockDeclaration';
import {ObjUtils} from '../utils/objUtils';
import {ASTNodeType} from '../../core/enums/astNodeType';

/**
 * Represents an ICL settings file
 * This is basically the root of the AST
 *
 *                  Configuration Dependency
 *                          |
 *                          |
 *                          v
 *        ImportDeclaration, SettingsBlockDeclaration1,....
 */
export class ConfigurationFile extends ArrayExpression<ImportDeclaration | SettingsBlockDeclaration> {

    constructor(loc: Loc) {
        super(loc);
    }

    /**
     * Returns import declaration
     * @returns {Array<ImportDeclaration>}
     */
    public get importsDeclarations(): Array<ImportDeclaration> {
        return <Array<ImportDeclaration>>this.elements.filter((element) => {
            return element instanceof ImportDeclaration;
        });
    }

    /**
     * Returns all settings block declaration
     * @returns {Array<SettingsBlockDeclaration>}
     */
    public get settingsBlockDeclarations(): Array<SettingsBlockDeclaration> {
        return <Array<SettingsBlockDeclaration>>this.elements.filter((element) => {
            return element instanceof SettingsBlockDeclaration;
        });
    }

    public toString(): string {
        return this.elements.map((element) => {
            return element.toString();
        }).join('\r\n');
    }

    public toJson(): any {
        let obj: any = {};
        for (let settingsDeclarationBlock of this.settingsBlockDeclarations) {
            ObjUtils.createMultilevelProperty(obj, settingsDeclarationBlock.bundle.getJSONRelativePath(), settingsDeclarationBlock.toJson());
        }
        return obj;
    }


    protected getType(): ASTNodeType {
        return ASTNodeType.ConfigurationFile;
    }

    protected getKind(): ASTNodeKind {
        return ASTNodeKind.None;
    }

}