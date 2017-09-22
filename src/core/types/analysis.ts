import {FsResource} from '../../compiler/resource/fsResource';
import {ConfigurationFile} from '../../core/ast/configurationFile';
import {CompilerOption} from '../../core/enums/compilerOption';

/**
 * The ICLParser common interface
 */
export interface IICLCompiler<L, T> {
    /**
     * Generates a JSON FlatAST
     * @description performs a recursive lexical and grammatical analysis.ts and returns a json
     * @Param {String|string} filePath
     * @Param {Array<string>} inject
     * @Param searchIn
     * @private
     */
    ast(resource: FsResource<L, T>, inject: Array<FsResource<L, T>>): Array<ConfigurationFile>;

    /**
     *
     * @Param {Array<ConfigurationFile>} configurations
     * @Param generatedSettings
     * @returns {Object}
     */
    compile(resource: FsResource<L, T>, inject: Array<FsResource<L, T>>, generatedSettings: any, options?: CompilerOption): { ast: Array<T>, aliases: { [key: string]: any; }, compiled: Object };

}

export type LexYaccError = {
    hash: Hash,
    message: string
}
export type Hash = {
    expected: Array<string>,
    line: number,
    text: string,
    token: string,
    loc: Loc
}
export type Loc = {
    file_uri: string,
    file_hash: string,
    first_column: number,
    first_line: number,
    last_column: number,
    last_line: number
}