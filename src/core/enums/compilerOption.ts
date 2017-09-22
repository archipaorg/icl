/**
 * Compiler options available
 */
export enum CompilerOption {
    // remove empty object entries e.g. {}
    DontRemoveEmptyObject = 1,
    // remove empty array e.g. []
    DontRemoveEmptyArray = 2,
    // remove null values e.g. {key:null}
    DontRemoveNullValues = 3,
    // remove lib sections e.g. ::var "name"
    DontRemoveLibSections = 4
}