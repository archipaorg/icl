/**
 * Available ASTNodeType
 */
export enum ASTNodeType {
    // root element
    ConfigurationFile = 1,
    // e.g. 1, "hey"
    Literal = 2,
    // list of elements e.g. [1, "hey jerry"]
    ArrayExpression = 3,
    // e.g. {key="value"}
    SettingsBlockDeclaration = 4,
    // an identifier e.g core
    Identifier = 5,
    // take file1,file2...
    ImportDeclaration = 6,
    // settings block type
    JSONPathExpression = 7,
    // imported file e.g. file1, ../file2
    ImportFile = 8,
    // keyword e.g as, from, ...
    Keyword = 9,
    // e.g core "web" "app"
    SettingsBlockBundle = 10,
    // e.g. core "web" "app" as WebApp
    SettingsBlockAlias = 11,
    // e.g {port = 80}
    SettingsBlockPropertyDeclarator = 12,
    // e.g a complex value e.g {port = 80}
    SettingsBlockComplexValue = 13,
    // mixin block params e.g. core "app" @port {...} or core "app" apply http @port=80
    SettingsBlockParam = 14,
    // core "app" from webapp
    SettingsBlockInheritance = 15,
    // param and it's associated value
    SettingsBlockArg = 16,
    // 2d array of elements
    Table = 17,
    // end of file
    EOF = 18
}