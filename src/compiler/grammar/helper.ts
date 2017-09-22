import {Loc} from '../../core/types/analysis';

/**
 * Helpers method to create different kind of AST nodes
 */
export class Helper {
    // create ConfigurationFile instance
    public static createConfigurationFile(yy: any, startLoc: Loc, endLoc: Loc) {
        return new yy.ConfigurationFile(yy.ConfigurationFile.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
    }

// create Keyword instance
    public static createKeyword(yy: any, startLoc: Loc, endLoc: Loc, keyword: any) {
        return new yy.Keyword(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword
        );
    }

// create literal
    public static createLiteral(yy: any, startLoc: Loc, endLoc: Loc, data: any) {
        return new yy.Literal(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            data
        );
    }

// create a new instance of ArrayExpression
    public static createArrayExpression(yy: any, startLoc: Loc, endLoc: Loc) {
        return new yy.ArrayExpression(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line)
        );
    }

    public static createTable(yy: any, startLoc: Loc, endLoc: Loc, keyword: any, values: any) {
        return new yy.Table(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword, values
        );
    }

    public static createIdentifier(yy: any, startLoc: Loc, endLoc: Loc, identifier: any) {
        return new yy.Identifier(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            identifier
        );
    }

    public static createSettingsBlockParam(yy: any, startLoc: Loc, endLoc: Loc, Param: any) {
        return new yy.Param(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            Param
        );
    }

    public static createSettingsBlockArg(yy: any, startLoc: Loc, endLoc: Loc, arg: any, value: any) {
        return new yy.Arg(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            arg,
            value
        );
    }

    public static createAlias(yy: any, startLoc: Loc, endLoc: Loc, keyword: any, identifier: any) {
        return new yy.Alias(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword,
            identifier
        );
    }

    public static createJsonExpression(yy: any, startLoc: Loc, endLoc: Loc, expression: any) {
        return new yy.JSONPathExpression(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            expression
        );
    }

// create ImportDeclaration instance
    public static createImportDeclaration(yy: any, startLoc: Loc, endLoc: Loc, keyword: any, importedFiles: any) {
        return new yy.ImportDeclaration(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword,
            importedFiles
        );
    }

    public static createSettingsBlockPropertyDeclarator(yy: any, startLoc: Loc, endLoc: Loc, identifier: any, value: any) {
        return new yy.PropertyDeclarator(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            identifier, value
        );
    }

    public static createSettingsBlockComplexValue(yy: any, startLoc: Loc, endLoc: Loc) {
        return new yy.ComplexValue(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
    }

    public static createSettingsBlockInheritanceDeclaration(yy: any, startLoc: Loc, endLoc: Loc, keyword: any, inheritance: any) {
        return new yy.InheritanceDeclaration(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword,
            inheritance
        );
    }

    public static createSettingsblockInheritance(yy: any, startLoc: Loc, endLoc: Loc, path: any) {
        return new yy.Inheritance(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            path
        );
    }


    public static createImportFile(yy: any, startLoc: Loc, endLoc: Loc, file: any) {
        return new yy.Dependency(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            file
        );
    }

    public static createBundle(yy: any, startLoc: Loc, endLoc: Loc, identifier: any, ns: any) {
        return new yy.Bundle(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            identifier, ns
        );
    }

    public static createSettingsBlockDeclaration(yy: any, startLoc: Loc, endLoc: Loc) {
        return new yy.SettingsBlockDeclaration(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
    }


    public static createEOF(yy: any, endLoc: Loc) {
        return new yy.EOF(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, endLoc.last_column, endLoc.last_line, endLoc.last_column, endLoc.last_line));
    }
}