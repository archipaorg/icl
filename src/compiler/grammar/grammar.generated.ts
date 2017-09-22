// AUTO GENERATED from the grammar.yy. DO NOT MODIFY !
// This file is embedded in the npm package for an easy delivery 

export const Grammar:string = JSON.stringify({
  "lex": {
    "rules": [
      [
        "{MULTILINE_COMMENT}|{INLINE_COMMENT}",
        "/*skip comments*/"
      ],
      [
        "^take",
        "\n                                                                                    this.begin('take_begin_declaration');\n                                                                                    return 'TAKE_DECLARATION';\n                                                                                "
      ],
      [
        [
          "take_begin_declaration"
        ],
        "{COMMA}",
        "\n                                                                                    return 'IMPORT_SEPARATOR';\n                                                                                "
      ],
      [
        [
          "take_begin_declaration"
        ],
        "((\\$\\/)*(({ASCII_CHAR}|[.]{1,2})+)(\\/({ASCII_CHAR}+|[.]{1,2}))*)",
        "\n                                                                                    //console.log(yy.lexer.rules);\n                                                                                    return 'FILE_NAME';\n                                                                                "
      ],
      [
        [
          "take_begin_declaration"
        ],
        "{NEWLINE}+",
        "\n                                                                                    this.popState();\n                                                                                "
      ],
      [
        "[\\s|\\r\\n|\\r|\\n]+",
        "/* skip whitespaces + new lines */"
      ],
      [
        [
          "start_block_hierarchy",
          "start_block_param_declaration",
          "start_block_declaration"
        ],
        "\\bfrom\\b",
        "\n                                                                                    this.begin('start_inheritance_declaration');\n                                                                                    return 'FROM';\n                                                                                "
      ],
      [
        [
          "start_block_hierarchy"
        ],
        "\\bapply\\b",
        "\n                                                                                    return 'APPLY';\n                                                                                "
      ],
      [
        [
          "start_block_hierarchy"
        ],
        "\\bas\\b",
        "                                                                                    \n                                                                                    return 'AS';\n                                                                                "
      ],
      [
        [
          "start_block_hierarchy"
        ],
        "\\btable\\b",
        "\n                                                                                    return 'TABLE';\n                                                                                "
      ],
      [
        "\\b{NONDIGIT_ASCII_CHAR}+({DIGIT}|{NONDIGIT_ASCII_CHAR})*(\\.{NONDIGIT_ASCII_CHAR}+({DIGIT}|{NONDIGIT_ASCII_CHAR})?)+\\b",
        "                                                                                    \n                                                                                    return 'PARENT_BLOCK';\n                                                                                "
      ],
      [
        "(?!true|false|null)(::)?\\b({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)|(true|false|null)({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)\\b",
        "   \n                                                                                    //console.log(yy.lexer.rules);\n                                                                                    this.begin('start_block_declaration');\n                                                                                    return 'IDENTIFIER';\n                                                                                 "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy"
        ],
        "{DBL_QUOTE}\\b{NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*\\b{DBL_QUOTE}",
        "\n                                                                                     this.begin('start_block_hierarchy');\n                                                                                     //https://github.com/zaach/jison/issues/340\n                                                                                     // remove string quotes\n                                                                                     yytext = this.matches[0].replace(/^\"|\"$/g, '');\n                                                                                     return 'ASCII_STRING';\n                                                                                 "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_block_param_declaration"
        ],
        "({PARAM_PREFIX}{1,2})({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)(\\.({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*))*",
        "\n                                                                                    //console.log(yy.lexer.rules);\n                                                                                    this.begin('start_block_param_declaration');\n                                                                                    return 'PARAM';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_inheritance_declaration"
        ],
        "{PARAM_PREFIX}",
        "                                                                                   \n                                                                                    return 'PARAM_PREFIX';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_inheritance_declaration",
          "start_block_hierarchy",
          "start_block_param_declaration"
        ],
        "{MULTILINE_STRING}",
        "                                                                                    \n                                                                                    // retrieve marker seq\n                                                                                    let markerSeq = this.matches[0].replace(/['<']{3}([a-z|A-Z|_]+)(.|\\r|\\n)*\\1/g, '$1'); \n                                                                                    // remove here document\n                                                                                    yytext = this.matches[0].replace(new RegExp('^<<<'+markerSeq+'|'+markerSeq+'$', \"g\"),'');\n                                                                                    return 'BLOCK_VALUE_PRIMITIVE';\n                                                                                 "
      ],
      [
        [
          "start_block_declaration",
          "start_inheritance_declaration",
          "start_block_hierarchy",
          "start_block_param_declaration"
        ],
        "({NUMBER}|{BOOLEAN}|{STRING}|{NULL})",
        "                                                                                   \n                                                                                    if(!isNaN(yytext)) {\n                                                                                        yytext = Number(yytext);\n                                                                                    }                                                                                    \n                                                                                    if(typeof yytext ==='string') {                                                                                                                                                                   \n                                                                                        // remove string quotes\n                                                                                        //yytext = this.matches[0].replace(/^\"|\"|^'|'$/g, '');\n                                                                                        yytext = this.matches[0].replace(/^\"|\"$|^'|'$/g, '');\n                                                                                        //yytext = this.matches[0].replace(/^'|'$/g, '');\n                                                                                        if(yytext.toLowerCase() === 'true') {\n                                                                                            yytext = true;\n                                                                                        } else if(yytext.toLowerCase() === 'false') {\n                                                                                            yytext = false;\n                                                                                        } \n                                                                                        else if(yytext == 'null') {\n                                                                                            yytext = {};\n                                                                                        }                                                                                        \n                                                                                    }\n\n                                                                                    return 'BLOCK_VALUE_PRIMITIVE';\n                                                                                 "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_inheritance_declaration",
          "start_block_param_declaration"
        ],
        "\\{",
        "\n                                                                                    return 'BLOCK_VALUE_COMPLEX_START';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_inheritance_declaration",
          "start_block_param_declaration"
        ],
        "\\}",
        "        \n                                                                                    this.popState();\n                                                                                    this.popState();\n                                                                                    return 'BLOCK_VALUE_COMPLEX_END';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_inheritance_declaration",
          "start_block_param_declaration"
        ],
        "{EQUAL_OPERATOR}",
        "\n                                                                                    return 'EQUAL_OPERATOR';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_inheritance_declaration",
          "start_block_param_declaration"
        ],
        "{CLOSE_BRACKET}",
        "\n                                                                                    return 'CLOSE_BRACKET';\n                                                                                "
      ],
      [
        [
          "start_block_declaration",
          "start_block_hierarchy",
          "start_inheritance_declaration",
          "start_block_param_declaration"
        ],
        "{OPEN_BRACKET}",
        "\n                                                                                    return 'OPEN_BRACKET';\n                                                                                "
      ],
      [
        "{COMMA}",
        "\n                                                                                    return 'COMMA_SEPARATOR';\n                                                                                "
      ],
      [
        "$",
        "return 'EOF'    ;"
      ],
      [
        ".",
        "return 'INVALID';"
      ]
    ],
    "macros": {
      "CLOSE_BRACKET": "\\]",
      "OPEN_BRACKET": "\\[",
      "PARAM_PREFIX": "['@']",
      "INLINE_COMMENT": "(#|\\/\\/).*?(\\n|\\$)",
      "MULTILINE_COMMENT": "(\\/\\*([^*]|[\\r\\n]|(\\*+([^*\\/]|[\\r\\n])))*\\*+\\/)|(\\/\\/.*)",
      "ALL_CHARS": "[\\s|\\S]",
      "ANY_CHAR": ".|[\\r|\\n]",
      "NEWLINE": "[\\n|\\r]",
      "WHITESPACE": "[\\s|\\n|\\r|\\t]",
      "COMMA": "[,]",
      "DBL_QUOTE": "[\"]",
      "SINGLE_QUOTE": "[\"'\"]",
      "ASCII_CHAR": "[a-z|A-Z|_|\\-|0-9]",
      "CHARS": "{CHAR}+",
      "MULTILINE_STRING": "['<']{3}([a-z|A-Z|_]+)(.|\\r|\\n)*\\2",
      "STRING": "((?=[\\\"\\'])(?:\"[^\\\"\\\\]*(?:\\\\[\\s\\S][^\\\"\\\\]*)*\"|'[^\\'\\\\]*(?:\\\\[\\s\\S][^\\'\\\\]*)*'))",
      "CHAR": "{UNESCAPEDCHAR}|{ESCAPEDCHAR}|{UNICODECHAR}",
      "u": "{HEX_DIGIT}{HEX_DIGIT}{HEX_DIGIT}{HEX_DIGIT}",
      "UNICODECHAR": "\\\\",
      "ESCAPEDCHAR": "\\\\[\"\\\\bfnrt/]",
      "UNESCAPEDCHAR": "[ -!#-\\[\\]-~]",
      "NONDIGIT_ASCII_CHAR": "[a-z|A-Z|_|\\-]",
      "NULL": "null",
      "NUMBER": "{FLOAT}|{INTEGER}",
      "HEX_DIGIT": "[0-9a-f]",
      "E": "[eE][+-]?",
      "EXP": "{E}{DIGITS}",
      "FRAC": "[.]{DIGITS}",
      "BOOLEAN": "true|false",
      "INTEGER": "{DIGITS}|-{DIGITS}|\\+{DIGITS}",
      "EQUAL_OPERATOR": "['=']",
      "FLOAT": "['+'|'-']?{DIGITS}[.]{DIGITS}",
      "DIGITS": "{DIGIT}+",
      "DIGIT": "[0-9]"
    },
    "startConditions": {
      "start_block_param_declaration": 0,
      "start_inheritance_declaration": 0,
      "take_begin_declaration": 0,
      "start_block_hierarchy": 0,
      "start_block_declaration": 0
    },
    "options": {
      "flex": true
    }
  },
  "start": "configuration_file",
  "moduleInclude": "\n\n",
  "bnf": {
    "configuration_file": [
      [
        "configuration_file_content EOF",
        "\n                    // create a ConfiurationFile instance\n                    $$ = yy.Helper.createConfigurationFile(yy, @1, @1);\n                    $$.addElements($1);              \n                    return $$;\n                "
      ]
    ],
    "configuration_file_content": [
      [
        "import_block configuration_file_content",
        " \n                    // create an ImportDeclaration instance                     \n                    $$ = [$1];\n                    if($2) {\n                       $$ = $$.concat($2);\n                    }\n               "
      ],
      [
        "settings_block configuration_file_content",
        "\n                    // settings block declaration                    \n                    $$ = [$1];\n                    if($2) {\n                        $$ = $$.concat($2);\n                    }\n               "
      ],
      [
        "",
        "\n                    $$ = yy.Helper.createEOF(yy, @$);\n                "
      ]
    ],
    "settings_block": [
      [
        "IDENTIFIER hierarchy_levels alias settings_block_value",
        "\n                // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n\n                // create alias\n                var aliasNode = $3;\n\n                // create setting block declaration node\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @4);\n                $$.bundle = bundleNode;\n                $$.alias = aliasNode;\n                $$.value = $4;\n  \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @4.last_column;\n                @$.last_line = @4.last_line;\n              "
      ],
      [
        "IDENTIFIER hierarchy_levels alias FROM parent_block_list single_param settings_block_value",
        "\n                \n                // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n\n                // create alias\n                var aliasNode = $3;\n\n                var inheritanceNode = yy.Helper.createArrayExpression(yy, @5, @5);                \n                inheritanceNode.addElements($5);\n                // create inheritance\n                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @4, @5, yy.Helper.createKeyword(yy, @4, @4, $4), inheritanceNode);\n                // get Param\n\n                // create setting block declaration node\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @7);\n                $$.bundle = bundleNode;\n                $$.inheritFrom = inheritanceDeclaratorNode;\n                $$.alias = aliasNode;\n                $$.initWith = $6;\n                $$.value = $7;\n  \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @7.last_column;\n                @$.last_line = @7.last_line;  \n                \n             "
      ],
      [
        "IDENTIFIER hierarchy_levels alias param_list FROM parent_block_list single_param settings_block_value",
        "\n                // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n\n                // create alias\n                var aliasNode = $3;\n\n                var inheritanceNode = yy.Helper.createArrayExpression(yy, @6, @6);\n                inheritanceNode.addElements($6);\n                // create inheritance\n                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @5, @6, yy.Helper.createKeyword(yy, @5, @5, $5), inheritanceNode);\n                // get Param\n                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @4, @4);\n                paramsArrayExpression.addElements($4);\n                // create setting block declaration node\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @8);\n                $$.bundle = bundleNode;\n                $$.inheritFrom = inheritanceDeclaratorNode;\n                $$.alias = aliasNode;\n                $$.initWith = $7;\n                $$.params = paramsArrayExpression;\n                $$.value = $8;\n  \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @8.last_column;\n                @$.last_line = @8.last_line;  \n             "
      ],
      [
        "IDENTIFIER hierarchy_levels APPLY parent_block_list param_value_list",
        "\n                // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n                var inheritanceNode = yy.Helper.createArrayExpression(yy, @4, @4);\n                //console.log(inheritanceNode.id);\n                inheritanceNode.addElements($4);\n                //console.log(inheritanceNode.elements[0].parent.id);\n                // create inheritance\n                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @3, @4, yy.Helper.createKeyword(yy, @3, @3, $3), inheritanceNode);\n                // get Param\n                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @5, @5);\n                paramsArrayExpression.addElements($5);\n                // create setting block declaration node\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);\n                $$.bundle = bundleNode;\n                $$.inheritFrom = inheritanceDeclaratorNode;\n                var argsValues = yy.Helper.createArrayExpression(yy, @5, @5);\n                argsValues.addElements($5);\n                $$.initWith = argsValues;\n  \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @5.last_column;\n                @$.last_line = @5.last_line;\n             "
      ],
      [
        "IDENTIFIER hierarchy_levels alias param_list settings_block_value",
        "\n                 // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n                // create alias\n                var aliasNode = $3;\n                // get Param\n                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @4, @4);\n                paramsArrayExpression.addElements($4);\n                // create setting block declaration node\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);\n                $$.bundle = bundleNode;\n                $$.alias = aliasNode;                \n                $$.params = paramsArrayExpression;\n                $$.value = $5;\n  \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @5.last_column;\n                @$.last_line = @5.last_line;\n             "
      ],
      [
        "IDENTIFIER hierarchy_levels alias TABLE settings_table_values",
        "                 \n                // create identifier \n                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);\n                // create namespace \n                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);\n                namespaceNode.addElements($2);\n                // create bundle\n                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);\n                // create alias\n                var aliasNode = $3;\n                \n                var tableValues = yy.Helper.createArrayExpression(yy, @5, @5, $5);\n                tableValues.addElements($5);\n                var valuesNodes = yy.Helper.createTable(yy, @5, @5, yy.Helper.createKeyword(yy, @4, @4, $4), tableValues);\n\n                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);\n                $$.bundle = bundleNode;\n                $$.alias = aliasNode;\n                $$.value = valuesNodes;\n                \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @5.last_column;\n                @$.last_line = @5.last_line;\n\n             "
      ]
    ],
    "alias": [
      [
        "AS IDENTIFIER",
        "\n                $$ = yy.Helper.createAlias(yy, @1, @2, yy.Helper.createKeyword(yy, @1, @1, $1), yy.Helper.createIdentifier(yy, @2, @2, $2));\n            "
      ],
      ""
    ],
    "single_param": [
      [
        "PARAM_PREFIX BLOCK_VALUE_PRIMITIVE",
        "                \n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @2, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @2, @2, $2));\n            "
      ],
      ""
    ],
    "hierarchy_levels": [
      [
        "ASCII_STRING hierarchy_levels",
        "\n                var sbPathPart = yy.Helper.createLiteral(yy, @1, @1, $1);                \n                $$ = [sbPathPart];\n                if($2) {\n                   $$ = $$.concat($2);\n                }                \n             "
      ],
      [
        "ASCII_STRING",
        "\n                var sbPathPart = yy.Helper.createLiteral(yy, @1, @1, $1);                \n                $$ = [sbPathPart];\n            "
      ]
    ],
    "parent_block_list": [
      [
        "IDENTIFIER COMMA_SEPARATOR parent_block_list",
        "               \n                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);\n                $$ = [$$];\n                if($3) {\n                    $$.push($3[0]);\n                }\n            "
      ],
      [
        "PARENT_BLOCK COMMA_SEPARATOR parent_block_list",
        "              \n                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);\n                $$ = [$$];\n                if($3) {\n                    $$.push($3[0]);\n                }\n            "
      ],
      [
        "PARENT_BLOCK",
        "\n                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER",
        "\n                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);\n                $$ = [$$];\n            "
      ]
    ],
    "param_list": [
      [
        "PARAM",
        "\n                $$ = yy.Helper.createSettingsBlockParam(yy, @1, @1, $1);\n                $$ = [$$];\n            "
      ],
      [
        "PARAM COMMA_SEPARATOR param_list",
        "\n                $$ = yy.Helper.createSettingsBlockParam(yy, @1, @1, $1);\n                $$ = [$$];\n                if($3) {\n                   $$ = $$.concat($3);\n                   @$.last_line = @3.last_line;\n                   @$.last_column = @3.last_column;\n                }\n            "
      ]
    ],
    "param_value_list": [
      [
        "PARAM EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                \n                $$ = [$$];\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR param_value_list",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                \n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR list",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), $3);                \n                $$ = [$$];\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR list COMMA_SEPARATOR param_value_list",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), $3);                \n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR ASCII_STRING",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                \n                $$ = [$$];\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR param_value_list",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                \n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR PARENT_BLOCK",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));                \n                $$ = [$$];\n            "
      ],
      [
        "PARAM EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR param_value_list",
        "\n                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));                \n                $$ = [$$];             \n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ]
    ],
    "settings_block_value": [
      [
        "BLOCK_VALUE_PRIMITIVE",
        " \n                        $$ = yy.Helper.createLiteral(yy, @1, @1, $1);\n                    "
      ],
      [
        "list",
        "                           \n                        $$ = $1;\n                    "
      ],
      [
        "config_block",
        "\n                        // sb value declaration                        \n                        $$ = $1;\n                    "
      ]
    ],
    "settings_table_values": [
      [
        "ASCII_STRING EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE",
        "\n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                    "
      ],
      [
        "ASCII_STRING EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values",
        "                         \n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                        if($5) {\n                            $$ = $$.concat($5);\n                        }             \n                    "
      ],
      [
        "ASCII_STRING EQUAL_OPERATOR ASCII_STRING",
        "     \n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                    "
      ],
      [
        "ASCII_STRING EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values",
        "       \n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                        if($5) {\n                            $$ = $$.concat($5);\n                        }                       \n                    "
      ],
      [
        "BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE",
        "\n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                    "
      ],
      [
        "BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values",
        "    \n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                        if($5) {\n                            $$ = $$.concat($5);\n                        }                          \n                    "
      ],
      [
        "BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING",
        "\n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                    "
      ],
      [
        "BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values",
        "       \n                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                        $$ = [$$];\n                        if($5) {\n                            $$ = $$.concat($5);\n                        }                      \n                    "
      ]
    ],
    "config_block": [
      [
        "BLOCK_VALUE_COMPLEX_START config_block_content BLOCK_VALUE_COMPLEX_END",
        "\n                $$ = yy.Helper.createSettingsBlockComplexValue(yy, @1, @3);\n                $$.addElements($2);\n                @$.first_line = @1.first_line;\n                @$.first_column = @1.first_column;\n                @$.last_line = @3.last_line;\n                @$.last_column = @3.last_column;                \n            "
      ],
      [
        "BLOCK_VALUE_COMPLEX_START BLOCK_VALUE_COMPLEX_END",
        "\n                $$ = yy.Helper.createSettingsBlockComplexValue(yy, @1, @2);\n                @$.first_line = @1.first_line;\n                @$.first_column = @1.first_column;\n                @$.last_line = @2.last_line;\n                @$.last_column = @2.last_column;\n            "
      ]
    ],
    "config_block_content": [
      [
        "IDENTIFIER EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                \n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR config_block_content",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR PARAM",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createSettingsBlockParam(yy, @3, @3, $3));\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR PARAM COMMA_SEPARATOR config_block_content",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createSettingsBlockParam(yy, @3, @3, $3));\n                $$ = [$$];\n                if($5) {\n                    $$  = $$.concat($5);\n                }\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR ASCII_STRING",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR config_block_content",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));\n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR list",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR list COMMA_SEPARATOR config_block_content",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);\n                $$ = [$$];\n                if($5) {\n                    $$ = $$.concat($5);\n                }\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR config_block",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR config_block COMMA_SEPARATOR config_block_content",
        "\n               $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);\n               $$ = [$$];\n               if($5) {\n                   $$ = $$.concat($5);\n               }\n            "
      ],
      [
        "list_settings_subblock",
        "\n                // TODO check if this solution is clean\n                $$ = $1;\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR PARENT_BLOCK",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));\n                $$ = [$$];\n            "
      ],
      [
        "IDENTIFIER EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR config_block_content",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));\n                $$ = [$$];\n                if($5) {\n                   $$ = $$.concat($5); \n               }\n            "
      ]
    ],
    "list": [
      [
        "OPEN_BRACKET list_elements CLOSE_BRACKET",
        "\n                $$ = yy.Helper.createArrayExpression(yy, @1, @3);   \n                $$.addElements($2);                \n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @3.last_column;\n                @$.last_line = @3.last_line; \n            "
      ],
      [
        "OPEN_BRACKET CLOSE_BRACKET",
        "\n                $$ = yy.Helper.createArrayExpression(yy, @1, @2); \n                @$.last_column = @2.last_column;\n                @$.last_line = @2.last_line;    \n            "
      ]
    ],
    "list_elements": [
      [
        "list_element",
        "\n                $$ = [$1];\n            "
      ],
      [
        "list_element COMMA_SEPARATOR list_elements",
        "\n                $$ = [$1];\n                if($3) {\n                   $$ = $$.concat($3);\n                }\n            "
      ]
    ],
    "list_element": [
      [
        "BLOCK_VALUE_PRIMITIVE",
        "\n                $$ = yy.Helper.createLiteral(yy, @1, @1, $1);                \n            "
      ],
      [
        "ASCII_STRING",
        "\n                $$ = yy.Helper.createLiteral(yy, @1, @1, $1);\n            "
      ],
      [
        "list",
        "\n                $$ = $1;\n            "
      ],
      [
        "config_block",
        "          \n                $$ = $1;\n            "
      ],
      [
        "PARENT_BLOCK",
        "\n                $$ = yy.Helper.createJsonExpression(yy, @1, @1, $1);                         \n            "
      ]
    ],
    "list_settings_subblock": [
      [
        "settings_block list_settings_subblock",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @1, yy.Helper.createIdentifier(yy, @1, @1, null), $1);  \n                $$ = [$$];\n                if($2) {\n                    $$ = $$.concat($2);\n                }\n            "
      ],
      [
        "settings_block",
        "\n                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @1, yy.Helper.createIdentifier(yy, @1, @1, null), $1);  \n                $$ = [$$];\n            "
      ]
    ],
    "import_block": [
      [
        "TAKE_DECLARATION import_list",
        "\n                // create keyword node\n                var keywordNode = yy.Helper.createKeyword(yy, @1, @1, $1);\n                // create import array expression node\n                var importArrayExpressionNode = yy.Helper.createArrayExpression(yy, @2, @2);\n                importArrayExpressionNode.addElements($2);\n                // create import declaration\n                var importDeclartion = yy.Helper.createImportDeclaration(yy, @1, @2, keywordNode, importArrayExpressionNode);\n\n                @$.first_column = @1.first_column;\n                @$.first_line = @1.first_line;\n                @$.last_column = @2.last_column;\n                @$.last_line = @2.last_line;            \n                $$ = importDeclartion;               \n            "
      ]
    ],
    "import_list": [
      [
        "FILE_NAME IMPORT_SEPARATOR import_list",
        "  \n                var importFileNode = yy.Helper.createImportFile(yy, @1, @1, $1);                            \n                $$ = [importFileNode];\n                if($3) {\n                  @$.first_column = @1.first_column;\n                  @$.first_line = @1.first_line;\n                  @$.last_column = @3.last_column;\n                  @$.last_line = @3.last_line;\n                  $$ = $$.concat($3);\n                }              \n            "
      ],
      [
        "FILE_NAME",
        "\n                var importFileNode = yy.Helper.createImportFile(yy, @1, @1, $1);                             \n                $$ = [importFileNode];\n            "
      ]
    ]
  }
}
);
