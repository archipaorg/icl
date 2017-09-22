///<reference path="../typings/jison.d.ts"/>

'use strict';

import * as extend from 'extend';
import * as Util from 'util';
import {Loc} from '../core/types/analysis';
import {ObjUtils} from '../core/utils/objUtils';
import {Parser} from 'jison';
import {Grammar} from './grammar/grammar.generated';
import {ASTNodeKind} from '../core/enums/astNodeKind';
import {ConfigurationFile} from '../core/ast/configurationFile';
import {ImportDeclaration} from '../core/ast/declaration/import/importDeclaration';
import {Dependency} from '../core/ast/declaration/import/dependency';
import {Keyword} from '../core/ast/base/keyword';
import {ArrayExpression} from '../core/ast/base/arrayExpression';
import {EOF} from '../core/ast/base/eof';
import {Alias} from '../core/ast/declaration/settings/alias';
import {Bundle} from '../core/ast/declaration/settings/bundle';
import {SettingsBlockDeclaration} from '../core/ast/declaration/settings/settingsBlockDeclaration';
import {Literal} from '../core/ast/base/literal';
import {Identifier} from '../core/ast/base/identifier';
import {JSONPathExpression} from '../core/ast/base/jsonPathExpression';
import {PropertyDeclarator} from '../core/ast/declaration/settings/propertyDeclarator';
import {ComplexValue} from '../core/ast/declaration/settings/complexValue';
import {Param} from '../core/ast/declaration/settings/param';
import {InheritanceDeclaration} from '../core/ast/declaration/settings/inheritanceDeclaration';
import {Arg} from '../core/ast/declaration/settings/arg';
import {Table} from '../core/ast/declaration/settings/table';
import {FsResource} from './resource/fsResource';
import {CompilerOption} from '../core/enums/compilerOption';
import {ASTNodeType} from '../core/enums/astNodeType';
import {IDisposable} from '../core/types/common';
import {Hash, IICLCompiler, LexYaccError} from '../core/types/analysis';
import {Inheritance} from '../core/ast/declaration/settings/inheritance';

/**
 * IclParser
 * @description this compiler takes a conf fileHash written in the native icl format and converts it to
 * a json document
 */
export class ICLCompiler implements IICLCompiler<string, ConfigurationFile>, IDisposable {

    /**
     * lex/yacc compiler
     */
    private readonly lexYaccParser: Parser;

    /**
     * Create an instance of the icl compiler
     * @constructor
     */
    constructor() {
        this.lexYaccParser = new Parser(JSON.parse(Grammar));
        // inject some necessary classes in yy context
        this.lexYaccParser.yy.extend = extend;
        this.lexYaccParser.yy.ConfigurationFile = ConfigurationFile;
        this.lexYaccParser.yy.ImportDeclaration = ImportDeclaration;
        this.lexYaccParser.yy.Keyword = Keyword;
        this.lexYaccParser.yy.ArrayExpression = ArrayExpression;
        this.lexYaccParser.yy.JSONPathExpression = JSONPathExpression;
        this.lexYaccParser.yy.Dependency = Dependency;
        this.lexYaccParser.yy.Alias = Alias;
        this.lexYaccParser.yy.Bundle = Bundle;
        this.lexYaccParser.yy.SettingsBlockDeclaration = SettingsBlockDeclaration;
        this.lexYaccParser.yy.PropertyDeclarator = PropertyDeclarator;
        this.lexYaccParser.yy.ComplexValue = ComplexValue;
        this.lexYaccParser.yy.Param = Param;
        this.lexYaccParser.yy.InheritanceDeclaration = InheritanceDeclaration;
        this.lexYaccParser.yy.Inheritance = Inheritance;
        this.lexYaccParser.yy.Arg = Arg;
        this.lexYaccParser.yy.Literal = Literal;
        this.lexYaccParser.yy.Identifier = Identifier;
        this.lexYaccParser.yy.Table = Table;
        this.lexYaccParser.yy.EOF = EOF;
        this.lexYaccParser.yy.ASTNodeType = ASTNodeType;
        this.lexYaccParser.yy.ASTNodeKind = ASTNodeKind;
    }


    /**
     * Parse a configuration file and generates an AST
     * @Param {string} settingsFile
     * @Param {Array<string>} inject
     * @Param {Array<string>} searchIn
     * @Param parentSettingsFile
     * @returns {Array<ConfigurationFile>}
     */
    public ast(resource: FsResource<string, ConfigurationFile>,
               inject: Array<FsResource<string, ConfigurationFile>> = []): Array<ConfigurationFile> {

        let allConfigurations: Array<ConfigurationFile> = [];

        try {

            if (resource.hasChanged || !resource.parsedContent) {
                // inject current file URI and file content fileHash in yy context
                this.lexYaccParser.yy.fileURI = resource.uri;
                this.lexYaccParser.yy.fileHash = resource.hash;
                resource.parsedContent = this.lexYaccParser.parse(resource.content());
            }

            allConfigurations.unshift(resource.parsedContent);

            // process injected inheritances
            for (let importFile of inject) {
                let dependencyAST = this.ast(importFile, []);
                allConfigurations = dependencyAST.concat(allConfigurations);
            }

            // process import declared inside
            for (let importsDeclaration of resource.parsedContent.importsDeclarations) {
                for (let importFile of importsDeclaration.importedFiles.elements) {
                    try {
                        let dependencyAST = this.ast(new FsResource(importFile.data, resource), []);
                        allConfigurations = dependencyAST.concat(allConfigurations);
                    } catch (e) {
                        if ('syscall' in e) {
                            throw <LexYaccError>{
                                hash: <Hash>{
                                    line: importFile.loc.first_line,
                                    loc: <Loc>{
                                        file_uri: importFile.loc.file_uri,
                                        file_hash: importFile.loc.file_hash,
                                        first_line: importFile.loc.first_line,
                                        first_column: importFile.loc.first_column,
                                        last_column: importFile.loc.last_column,
                                        last_line: importFile.loc.last_line
                                    }
                                },
                                message: Util.format('Can\'t find the imported file "%s" at %s' +
                                    ' line %s, col %s',
                                    importFile.data,
                                    importFile.loc.file_uri,
                                    importFile.loc.first_line,
                                    importFile.loc.first_column)
                            };
                        }
                    }
                }
            }

            return allConfigurations;
        } catch (e) {
            if (e.hash) {
                e.hash.loc.file_uri = resource.uri;
                e.hash.loc.file_hash = resource.hash;
            }
            // lex/yacc error
            throw e;
        }

    }


    /**
     * Compile a configuration file
     * @Param {string} path
     * @Param {Array<string>} inject
     * @Param {Array<string>} searchIn
     * @Param {CompilerOption} options
     * @returns {Object}
     */
    public compile(resource: FsResource<string, ConfigurationFile>, inject: Array<FsResource<string, ConfigurationFile>> = [], options?: CompilerOption): {
        ast: Array<ConfigurationFile>,
        aliases: { [key: string]: SettingsBlockDeclaration; },
        compiled: Object
    } {

        let configurations: Array<ConfigurationFile> = this.ast(resource, inject);
        let generatedSettings: any = ICLCompiler.preCompile(configurations);

        // flatCompile options
        let removeEmptyObj: boolean = !options || !((options & CompilerOption.DontRemoveEmptyObject)
            == CompilerOption.DontRemoveEmptyObject);
        let removeEmptyArray: boolean = !options || !((options & CompilerOption.DontRemoveEmptyArray)
            == CompilerOption.DontRemoveEmptyArray);
        let removeNullValues: boolean = !options || !((options & CompilerOption.DontRemoveNullValues)
            == CompilerOption.DontRemoveNullValues);
        let removeLibSection: boolean = !options || !((options & CompilerOption.DontRemoveLibSections)
            == CompilerOption.DontRemoveLibSections);

        /**
         * this will hold the final block settings value after
         * all the necessary treatement e.g. after inheritance
         * @type {{}}
         */
        let aliases: { [key: string]: SettingsBlockDeclaration; } = {};

        for (let configurationFile of configurations) {
            for (let sbDeclaration of configurationFile.settingsBlockDeclarations) {
                this.compileSettingsBlock(sbDeclaration, generatedSettings, aliases);
            }
        }

        if (removeLibSection) {
            // remove lib sections
            for (let configurationFile of configurations) {
                for (let sbDeclaration of configurationFile.settingsBlockDeclarations) {
                    if (sbDeclaration.bundle.isLib) {
                        ObjUtils.multilevelDelete(generatedSettings, <string>sbDeclaration.bundle.getJSONFullPath(true));
                    }
                }
            }
        }

        ObjUtils.clearEmpties(generatedSettings, removeEmptyObj, removeEmptyArray, removeNullValues);

        return {ast: configurations, aliases: aliases, compiled: ObjUtils.sortObject(generatedSettings)};
    }


    private compileSettingsBlock(sbDeclaration: SettingsBlockDeclaration,
                                 generatedSettings: any,
                                 aliases: { [key: string]: SettingsBlockDeclaration; }) {

        let checkLaterAlias = false;
        /**
         * The main idea is that for every settings block we :
         *      step 1 : Check if the current settings block defines an alias, if so then we save it in {@see aliases}
         *      step 2 : If the current settings block type is an alias then inherit from
         *      step 3 : Take the from field and iterate through all parent settings block
         *      and inherit from them
         *      step 4 : if it's a mixin block (args field is present), then we generate a new block with the given values
         *      step 5 : if there is another settings block declared inside then process it too
         *      step 6 : if we finished all the processing we remove all the settings block of type lib
         */

        /**
         * 1 - the logic here is that if an alias has already been defined
         * and this definition is in another fileHash than the original one
         * that we throw an exception
         * but if the alias has been declared in the same original fileHash or another settings block
         * then we don't raise an error since it's the same fileHash
         */
        if (sbDeclaration.alias) {
            if (sbDeclaration.alias.identifier.name in aliases // the current settings block is aliased && alias doesn't exists
                // and not in the same fileHash
                && (sbDeclaration.loc.file_hash != aliases[sbDeclaration.alias.identifier.name].loc.file_hash
                    // or not the same settings block
                    || sbDeclaration.hash != aliases[sbDeclaration.alias.identifier.name].hash
                )) {
                checkLaterAlias = true;
            } else {
                aliases[sbDeclaration.alias.identifier.name] = sbDeclaration; // save alias for easy check
            }
        }


        /**
         * step 2 The current block's type is actualy an alias e.g.
         * core "app" as App {...}
         *  and later on we declare
         * App "hello-world" {} so the settings block's type is "App" which is an alias
         * therefore we inherit from core.app
         */
        if (sbDeclaration.bundle.identifier.name in aliases) {
            // retrieve sb declaration
            let dbDeclaration = aliases[sbDeclaration.bundle.identifier.name];
            // since the current sb identifier name is an alias we must move it in the json object
            let sbJSON: any = ObjUtils.getMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath());
            // remove old json block
            ObjUtils.multilevelDelete(generatedSettings, <string>sbDeclaration.bundle.getJSONFullPath(true));
            // indicate that the type is actually an alias
            sbDeclaration.bundle.identifier.kind = ASTNodeKind.Alias;
            ObjUtils.createMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath(), sbJSON);

            if (sbDeclaration.inheritFrom) { // this sb declaration already inherit so we prepend our fake inheritance
                sbDeclaration.inheritFrom.addInheritance(new Inheritance(sbDeclaration.bundle.identifier.loc,
                    dbDeclaration.bundle.getJSONFullPath()));
            } else {
                // create fake location
                let loc: Loc = sbDeclaration.loc;
                // create fake keyword token
                let keyword: Keyword = new Keyword(loc, 'from');
                // create fake from declaration
                let fromDeclaration: ArrayExpression<Inheritance> = new ArrayExpression(loc);
                fromDeclaration.addElement(new Inheritance(loc, dbDeclaration.bundle.getJSONFullPath()));
                // set a fake inheritance declaration
                sbDeclaration.inheritFrom = new InheritanceDeclaration(loc, keyword, fromDeclaration);
            }
        } else {
            if (sbDeclaration.bundle.identifier.name == "StatusDetails") {
                console.log('error');
            }
        }

        // step 3
        if (sbDeclaration.inheritFrom && sbDeclaration.inheritFrom.inheritances) {

            let initiated: boolean = false;

            for (let fromPath of sbDeclaration.inheritFrom.inheritances.elements) {
                let parentPath: Inheritance;
                if (fromPath.isAlias()) { // the from path is composed of one word (it's an alias)
                    // check if this alias exists
                    if (fromPath.data in aliases) {
                        parentPath = new Inheritance(fromPath.loc, aliases[fromPath.data].bundle.getJSONFullPath());
                    } else {
                        throw <LexYaccError>{
                            hash: <Hash>{
                                line: fromPath.loc.first_line,
                                loc: <Loc>{
                                    file_uri: fromPath.loc.file_uri,
                                    file_hash: fromPath.loc.file_hash,
                                    first_line: fromPath.loc.first_line,
                                    first_column: fromPath.loc.first_column,
                                    last_column: fromPath.loc.last_column,
                                    last_line: fromPath.loc.last_line
                                }
                            },
                            message: Util.format('You can\'t inherit from an undefined alias parent block [%s] at %s' +
                                ' line %s, col %s',
                                fromPath.getPath().join('.'),
                                fromPath.loc.file_uri,
                                fromPath.loc.first_line,
                                fromPath.loc.first_column)
                        };
                    }
                } else {
                    parentPath = fromPath;
                }

                // settings inherited from ancestor
                let dbJSON = ObjUtils.getMultilevelProperty(generatedSettings, parentPath.getPath());

                if (dbJSON) {
                    if (typeof dbJSON === 'object') {
                        /**
                         if there is an init value then we take the first property and set it's value
                         e.g app "myapp" from git @"https://github.com" {}
                         */
                        if (!initiated
                            && sbDeclaration.initWith instanceof Arg
                            && (sbDeclaration.inheritFrom.inheritances.elements.length == 1)) {
                            //the idea here is to init only the first property of the first imports
                            (<any>dbJSON)[Object.keys(dbJSON)[0]]
                                = (<Arg>sbDeclaration.initWith).value.toJson();
                            //(<Literal<any> | ArrayExpression<any>>sbDeclaration.initWith).toJson();
                            initiated = true;
                        }
                        // retrieve current settings block json
                        let sbJSON = ObjUtils.getMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath());
                        let newSBJSON: any = {};
                        // update our settings block
                        extend(newSBJSON, dbJSON, sbJSON);
                        ObjUtils.createMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath(), newSBJSON);
                    } else {
                        // TODO enhance error message and add function for error message formatting
                        throw <LexYaccError>{
                            hash: <Hash>{
                                line: sbDeclaration.alias.loc.first_line,
                                loc: <Loc>{
                                    file_uri: sbDeclaration.alias.loc.file_uri,
                                    file_hash: sbDeclaration.alias.loc.file_hash,
                                    first_line: sbDeclaration.alias.loc.first_line,
                                    first_column: sbDeclaration.alias.loc.first_column,
                                    last_column: sbDeclaration.alias.loc.last_column,
                                    last_line: sbDeclaration.alias.loc.last_line
                                }
                            },
                            message: Util.format('Can\'t inherit from a primitive settings block value')
                        };
                    }
                } else {

                    throw <LexYaccError>{
                        hash: <Hash>{
                            line: sbDeclaration.alias.loc.first_line,
                            loc: <Loc>{
                                file_uri: sbDeclaration.alias.loc.file_uri,
                                file_hash: sbDeclaration.alias.loc.file_hash,
                                first_line: sbDeclaration.alias.loc.first_line,
                                first_column: sbDeclaration.alias.loc.first_column,
                                last_column: sbDeclaration.alias.loc.last_column,
                                last_line: sbDeclaration.alias.loc.last_line
                            }
                        },
                        message: Util.format('Can\'t find the parent settings block identified by "%s" in "%s", line %s, col %s',
                            fromPath.getPath().join('.'),
                            sbDeclaration.inheritFrom.right.loc.file_uri,
                            sbDeclaration.inheritFrom.right.loc.first_line,
                            sbDeclaration.inheritFrom.right.loc.first_column
                        )
                    };
                }

            }
        }

        // step 6 mixins
        ICLCompiler.processMixins(sbDeclaration, generatedSettings);
        // step 5 - process settings block declared in the value section
        for (let sbSubDeclaration of sbDeclaration.subSettingsBlocks) {
            this.compileSettingsBlock(sbSubDeclaration, generatedSettings, aliases);
        }
        ICLCompiler.processMixins(sbDeclaration, generatedSettings);

        if (checkLaterAlias && sbDeclaration.alias && sbDeclaration.alias.identifier.name in aliases // alias already exists
            // and not in the same fileHash
            && (sbDeclaration.loc.file_hash != aliases[sbDeclaration.alias.identifier.name].loc.file_hash
                // or not the same settings block
                || sbDeclaration.hash != aliases[sbDeclaration.alias.identifier.name].hash
            )) {
            let duplicateAliasDeclaration = aliases[sbDeclaration.alias.identifier.name];

            throw <LexYaccError>{
                hash: <Hash>{
                    line: sbDeclaration.alias.loc.first_line,
                    loc: <Loc>{
                        file_uri: sbDeclaration.alias.loc.file_uri,
                        file_hash: sbDeclaration.alias.loc.file_hash,
                        first_line: sbDeclaration.alias.loc.first_line,
                        first_column: sbDeclaration.alias.loc.first_column,
                        last_column: sbDeclaration.alias.loc.last_column,
                        last_line: sbDeclaration.alias.loc.last_line
                    }
                },
                message: Util.format('The alias [%s] defined in file %s, line %s, col %s ' +
                    'is already defined in file %s, line %s, col %s',
                    sbDeclaration.alias.identifier.name,
                    sbDeclaration.alias.loc.file_uri,
                    sbDeclaration.alias.loc.first_line,
                    sbDeclaration.alias.loc.first_column,
                    duplicateAliasDeclaration.alias.loc.file_uri,
                    duplicateAliasDeclaration.alias.loc.first_line,
                    duplicateAliasDeclaration.alias.loc.first_column
                )
            };
        }
        // step 7 interpolations
        ICLCompiler.interpolate(sbDeclaration, sbDeclaration.value, generatedSettings);
    }

    /**
     * Generates a json settings block tree based on the {@Param ASTList}
     * @Param {Array<ConfigurationFile>} ASTList
     * @returns {any}
     */
    private static preCompile(ASTList: Array<ConfigurationFile>): any {

        let obj: any = {};

        for (let ast of ASTList) {
            obj = extend(true, obj, ast.toJson());
        }

        return obj;
    }

    /**
     * Perform interpolation at all levels from top to down
     * @Param {SettingsBlockDeclaration} sbDeclaration
     * @Param generatedSettings
     */
    private static processMixins(sbDeclaration: SettingsBlockDeclaration,
                                 generatedSettings: any) {
        // step 4 - process mixin calls
        if (sbDeclaration.initWith && sbDeclaration.initWith instanceof ArrayExpression) {
            let argKeyVal: any = {};
            // eval all jsonpath expressions
            for (let arg of (<ArrayExpression<Literal<string | number | boolean>
                | ComplexValue
                | Arg>>sbDeclaration.initWith).elements) {

                if (arg instanceof Arg) {
                    if (arg.value instanceof JSONPathExpression) {
                        // evaluate jspath expression
                        arg.value.eval(generatedSettings);
                    }
                    argKeyVal[arg.param.name] = arg.value.toJson();
                }
            }

            let settingsBlockJson = ObjUtils.getMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath());
            // process replace value args
            ObjUtils.multilevelReplace(settingsBlockJson, ICLCompiler.filterObj(argKeyVal, (key) => {
                // take out all the args that starts with @@
                return key.startsWith('@@');
            }));
            // process set value args
            ObjUtils.multilevelSet(settingsBlockJson, ICLCompiler.filterObj(argKeyVal, (key) => {
                // take out all the args that starts with @
                return !key.startsWith('@@');
            }));
        }
    }

    private static interpolate(sbDeclaration: SettingsBlockDeclaration, sbValue: Literal<string | number | boolean>
        | ArrayExpression<Literal<string | number | boolean> | ComplexValue>
        | ComplexValue | PropertyDeclarator, generatedSettings: any) {
        if (sbValue) {
            for (let element of sbValue) {
                if (element instanceof JSONPathExpression) {
                    (<JSONPathExpression>element).eval(generatedSettings);
                    // replace
                    let settingsBlockJson = ObjUtils.getMultilevelProperty(generatedSettings, sbDeclaration.bundle.getJSONFullPath());
                    let argKeyVal: any = {};
                    argKeyVal[(<JSONPathExpression>element).id] = (<JSONPathExpression>element).toJson();
                    ObjUtils.multilevelReplace(settingsBlockJson, ICLCompiler.filterObj(argKeyVal, (key) => {
                        // take out all the args that starts with @
                        return key.startsWith('@@');
                    }));
                } else if (element instanceof ArrayExpression
                    || element instanceof ComplexValue
                    || element instanceof PropertyDeclarator) {
                    ICLCompiler.interpolate(sbDeclaration, element, generatedSettings);
                }
            }
        }
    }

    /**
     * filter object based on {@Param cb}
     * @Param obj
     * @Param {FilterObjCb} cb
     * @returns {any}
     */
    private static filterObj(obj: any, cb: (propertyName: string, propertyValue: string) => boolean) {
        let result: any = {};

        Object.keys(obj).forEach((key) => {
            if (!cb(key, obj[key])) {
                result[key] = obj[key];
            }
        });

        return result;
    };

    public dispose(): void {

    }

}