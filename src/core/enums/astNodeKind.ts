/**
 * NodeKind is like a subtype
 */
export enum ASTNodeKind {
    None = 1,
    Keyword = 2,
    Alias = 3,//pointer
    Namespace = 4,
    Type = 5,
    DataStructure = 6,
    AliasDefinition = 7,
    Property = 8
}