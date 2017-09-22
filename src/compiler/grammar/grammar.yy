/* ICL language grammar
*
* Copyright (c) 2017 by Mahieddine CHERIF
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
* Project : Ichiro configuration language
* Developed by : Mahieddine CHERIF 
*/

%lex

%options case-insensitive
%options flex

DIGIT                                                   [0-9]
DIGITS                                                  {DIGIT}+
FLOAT                                                   ['+'|'-']?{DIGITS}[.]{DIGITS}
EQUAL_OPERATOR                                          ['=']
INTEGER                                                 {DIGITS}|\-{DIGITS}|\+{DIGITS}
BOOLEAN                                                 "true"|"false"
FRAC                                                    [.]{DIGITS}
EXP                                                     {E}{DIGITS}
E                                                       [eE][+-]?
HEX_DIGIT                                               [0-9a-f]
NUMBER                                                  {FLOAT}|{INTEGER}
NULL                                                    "null"
NONDIGIT_ASCII_CHAR                                     [a-z|A-Z|_|\-]
UNESCAPEDCHAR                                           [ -!#-\[\]-~]
ESCAPEDCHAR                                             \\["\\bfnrt/]
UNICODECHAR                                             \\u{HEX_DIGIT}{HEX_DIGIT}{HEX_DIGIT}{HEX_DIGIT}
CHAR                                                    {UNESCAPEDCHAR}|{ESCAPEDCHAR}|{UNICODECHAR}
STRING                                                  ((?=[\"\'])(?:\"[^\"\\]*(?:\\[\s\S][^\"\\]*)*\"|\'[^\'\\]*(?:\\[\s\S][^\'\\]*)*\'))
MULTILINE_STRING                                        ['<']{3}([a-z|A-Z|_]+)(.|\r|\n)*\2
CHARS                                                   {CHAR}+
ASCII_CHAR                                              [a-z|A-Z|_|\-|0-9]
SINGLE_QUOTE                                            ["'"]                                  
DBL_QUOTE                                               ["]
COMMA                                                   [,]
WHITESPACE                                              [\s|\n|\r|\t]
NEWLINE                                                 [\n|\r]
ANY_CHAR                                                .|[\r|\n]
ALL_CHARS                                               [\s|\S]
MULTILINE_COMMENT                                       ('/*'([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|('//'.*)
INLINE_COMMENT                                          ('#'|'//').*?(\n|\$)
PARAM_PREFIX                                            ['@']  
OPEN_BRACKET                                            '['
CLOSE_BRACKET                                           ']'

%s start_block_declaration
%s start_block_hierarchy
%s take_begin_declaration
%s start_inheritance_declaration
%s start_block_param_declaration
%%

/* we must declare it before identifier! */

{MULTILINE_COMMENT}|{INLINE_COMMENT}                                            /*skip comments*/
^take                                                                           {
                                                                                    this.begin('take_begin_declaration');
                                                                                    return 'TAKE_DECLARATION';
                                                                                }

<take_begin_declaration>{COMMA}                                                 {
                                                                                    return 'IMPORT_SEPARATOR';
                                                                                }

<take_begin_declaration>((\$\/)*(({ASCII_CHAR}|[.]{1,2})+)(\/({ASCII_CHAR}+|[.]{1,2}))*)                {
                                                                                    //console.log(yy.lexer.rules);
                                                                                    return 'FILE_NAME';
                                                                                }

<take_begin_declaration>{NEWLINE}+                                              {
                                                                                    this.popState();
                                                                                }
[\s|\r\n|\r|\n]+   								                                /* skip whitespaces + new lines */
<start_block_hierarchy,start_block_param_declaration,start_block_declaration>\bfrom\b   {
                                                                                    this.begin('start_inheritance_declaration');
                                                                                    return 'FROM';
                                                                                }            
<start_block_hierarchy>\bapply\b                                                {
                                                                                    return 'APPLY';
                                                                                }
<start_block_hierarchy>\bas\b                                                   {                                                                                    
                                                                                    return 'AS';
                                                                                }
<start_block_hierarchy>\btable\b                                                {
                                                                                    return 'TABLE';
                                                                                }
\b{NONDIGIT_ASCII_CHAR}+({DIGIT}|{NONDIGIT_ASCII_CHAR})*('.'{NONDIGIT_ASCII_CHAR}+({DIGIT}|{NONDIGIT_ASCII_CHAR})?)+\b {                                                                                    
                                                                                    return 'PARENT_BLOCK';
                                                                                }                                                                                
/* an identifier indicate a start configuration block declaration
   so we initiate the state start_block_declaration
*/
(?!true|false|null)('::')?\b({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)|(true|false|null)({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)\b {   
                                                                                    //console.log(yy.lexer.rules);
                                                                                    this.begin('start_block_declaration');
                                                                                    return 'IDENTIFIER';
                                                                                 }
/*
   a block name declaration can only be declared after the begining of the block declaration
*/
<start_block_declaration,start_block_hierarchy>{DBL_QUOTE}\b{NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*\b{DBL_QUOTE}
                                                                                 {
                                                                                     this.begin('start_block_hierarchy');
                                                                                     //https://github.com/zaach/jison/issues/340
                                                                                     // remove string quotes
                                                                                     yytext = this.matches[0].replace(/^"|"$/g, '');
                                                                                     return 'ASCII_STRING';
                                                                                 }
<start_block_declaration,start_block_hierarchy,start_block_param_declaration>({PARAM_PREFIX}{1,2})({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*)('.'({NONDIGIT_ASCII_CHAR}+{DIGIT}*{NONDIGIT_ASCII_CHAR}*))* {
                                                                                    //console.log(yy.lexer.rules);
                                                                                    this.begin('start_block_param_declaration');
                                                                                    return 'PARAM';
                                                                                }
<start_block_declaration,start_inheritance_declaration>{PARAM_PREFIX}           {                                                                                   
                                                                                    return 'PARAM_PREFIX';
                                                                                }
/*
    a block primitive value can only exists after the block name
*/
<start_block_declaration,start_inheritance_declaration,start_block_hierarchy,start_block_param_declaration>{MULTILINE_STRING} {                                                                                    
                                                                                    // retrieve marker seq
                                                                                    let markerSeq = this.matches[0].replace(/['<']{3}([a-z|A-Z|_]+)(.|\r|\n)*\1/g, '$1'); 
                                                                                    // remove here document
                                                                                    yytext = this.matches[0].replace(new RegExp('^<<<'+markerSeq+'|'+markerSeq+'$', "g"),'');
                                                                                    return 'BLOCK_VALUE_PRIMITIVE';
                                                                                 }
/*
    a block primitive value can only exists after the block name
*/
<start_block_declaration,start_inheritance_declaration,start_block_hierarchy,start_block_param_declaration>({NUMBER}|{BOOLEAN}|{STRING}|{NULL}) {                                                                                   
                                                                                    if(!isNaN(yytext)) {
                                                                                        yytext = Number(yytext);
                                                                                    }                                                                                    
                                                                                    if(typeof yytext ==='string') {                                                                                                                                                                   
                                                                                        // remove string quotes
                                                                                        //yytext = this.matches[0].replace(/^"|"|^'|'$/g, '');
                                                                                        yytext = this.matches[0].replace(/^"|"$|^'|'$/g, '');
                                                                                        //yytext = this.matches[0].replace(/^'|'$/g, '');
                                                                                        if(yytext.toLowerCase() === 'true') {
                                                                                            yytext = true;
                                                                                        } else if(yytext.toLowerCase() === 'false') {
                                                                                            yytext = false;
                                                                                        } 
                                                                                        else if(yytext == 'null') {
                                                                                            yytext = {};
                                                                                        }                                                                                        
                                                                                    }

                                                                                    return 'BLOCK_VALUE_PRIMITIVE';
                                                                                 }
/*all complex block values starts with '{'*/
<start_block_declaration,start_block_hierarchy,start_inheritance_declaration,start_block_param_declaration>'{' 
                                                                                {
                                                                                    return 'BLOCK_VALUE_COMPLEX_START';
                                                                                }
/*all complex block values ends with '}'*/
<start_block_declaration,start_block_hierarchy,start_inheritance_declaration,start_block_param_declaration>'}' {        
                                                                                    this.popState();
                                                                                    this.popState();
                                                                                    return 'BLOCK_VALUE_COMPLEX_END';
                                                                                }
<start_block_declaration,start_block_hierarchy,start_inheritance_declaration,start_block_param_declaration>{EQUAL_OPERATOR} {
                                                                                    return 'EQUAL_OPERATOR';
                                                                                }
<start_block_declaration,start_block_hierarchy,start_inheritance_declaration,start_block_param_declaration>{CLOSE_BRACKET}                                                                  {
                                                                                    return 'CLOSE_BRACKET';
                                                                                }
<start_block_declaration,start_block_hierarchy,start_inheritance_declaration,start_block_param_declaration>{OPEN_BRACKET}                                                                  {
                                                                                    return 'OPEN_BRACKET';
                                                                                }
{COMMA}                                                                         {
                                                                                    return 'COMMA_SEPARATOR';
                                                                                }
<<EOF>>								                                            return 'EOF'    ;
.												                                return 'INVALID';

/lex


%start configuration_file
%%

configuration_file:
                configuration_file_content EOF {
                    // create a ConfiurationFile instance
                    $$ = createConfigurationFile(yy, @1, @1);
                    $$.addElements($1);              
                    return $$;
                }

            ;

configuration_file_content:
               // take file1, file2
               import_block configuration_file_content { 
                    // create an ImportDeclaration instance                     
                    $$ = [$1];
                    if($2) {
                       $$ = $$.concat($2);
                    }
               }
               | settings_block configuration_file_content {
                    // settings block declaration                    
                    $$ = [$1];
                    if($2) {
                        $$ = $$.concat($2);
                    }
               }       
               | {
                    $$ = createEOF(yy, @$);
                }
            ;

/* basic block definition block_type "name" value */
settings_block: 
              // match block id + block name eg: variable "var1" 1
             IDENTIFIER hierarchy_levels alias settings_block_value {
                // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                // create setting block declaration node
                $$ = createSettingsBlockDeclaration(yy, @1, @4);
                $$.bundle = bundleNode;
                $$.alias = aliasNode;
                $$.value = $4;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @4.last_column;
                @$.last_line = @4.last_line;
              }
                         
             | IDENTIFIER hierarchy_levels alias FROM parent_block_list single_param settings_block_value {
                
                // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                var inheritanceNode = createArrayExpression(yy, @5, @5);                
                inheritanceNode.addElements($5);
                // create inheritance
                var inheritanceDeclaratorNode = createSettingsBlockInheritanceDeclaration(yy, @4, @5, createKeyword(yy, @4, @4, $4), inheritanceNode);
                // get Param

                // create setting block declaration node
                $$ = createSettingsBlockDeclaration(yy, @1, @7);
                $$.bundle = bundleNode;
                $$.inheritFrom = inheritanceDeclaratorNode;
                $$.alias = aliasNode;
                $$.initWith = $6;
                $$.value = $7;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @7.last_column;
                @$.last_line = @7.last_line;  
                
             }
             | IDENTIFIER hierarchy_levels alias param_list FROM parent_block_list single_param settings_block_value {
                // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                var inheritanceNode = createArrayExpression(yy, @6, @6);
                inheritanceNode.addElements($6);
                // create inheritance
                var inheritanceDeclaratorNode = createSettingsBlockInheritanceDeclaration(yy, @5, @6, createKeyword(yy, @5, @5, $5), inheritanceNode);
                // get Param
                var paramsArrayExpression = createArrayExpression(yy, @4, @4);
                paramsArrayExpression.addElements($4);
                // create setting block declaration node
                $$ = createSettingsBlockDeclaration(yy, @1, @8);
                $$.bundle = bundleNode;
                $$.inheritFrom = inheritanceDeclaratorNode;
                $$.alias = aliasNode;
                $$.initWith = $7;
                $$.params = paramsArrayExpression;
                $$.value = $8;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @8.last_column;
                @$.last_line = @8.last_line;  
             }
             | IDENTIFIER hierarchy_levels APPLY parent_block_list param_value_list {
                // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);
                var inheritanceNode = createArrayExpression(yy, @4, @4);
                //console.log(inheritanceNode.id);
                inheritanceNode.addElements($4);
                //console.log(inheritanceNode.elements[0].parent.id);
                // create inheritance
                var inheritanceDeclaratorNode = createSettingsBlockInheritanceDeclaration(yy, @3, @4, createKeyword(yy, @3, @3, $3), inheritanceNode);
                // get Param
                var paramsArrayExpression = createArrayExpression(yy, @5, @5);
                paramsArrayExpression.addElements($5);
                // create setting block declaration node
                $$ = createSettingsBlockDeclaration(yy, @1, @5);
                $$.bundle = bundleNode;
                $$.inheritFrom = inheritanceDeclaratorNode;
                var argsValues = createArrayExpression(yy, @5, @5);
                argsValues.addElements($5);
                $$.initWith = argsValues;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @5.last_column;
                @$.last_line = @5.last_line;
             }
             | IDENTIFIER hierarchy_levels alias param_list settings_block_value {
                 // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);
                // create alias
                var aliasNode = $3;
                // get Param
                var paramsArrayExpression = createArrayExpression(yy, @4, @4);
                paramsArrayExpression.addElements($4);
                // create setting block declaration node
                $$ = createSettingsBlockDeclaration(yy, @1, @5);
                $$.bundle = bundleNode;
                $$.alias = aliasNode;                
                $$.params = paramsArrayExpression;
                $$.value = $5;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @5.last_column;
                @$.last_line = @5.last_line;
             }
             | IDENTIFIER hierarchy_levels alias TABLE settings_table_values {                 
                // create identifier 
                var identifierNode = createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = createBundle(yy, @1, @2, identifierNode, namespaceNode);
                // create alias
                var aliasNode = $3;
                
                var tableValues = createArrayExpression(yy, @5, @5, $5);
                tableValues.addElements($5);
                var valuesNodes = createTable(yy, @5, @5, createKeyword(yy, @4, @4, $4), tableValues);

                $$ = createSettingsBlockDeclaration(yy, @1, @5);
                $$.bundle = bundleNode;
                $$.alias = aliasNode;
                $$.value = valuesNodes;
                
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @5.last_column;
                @$.last_line = @5.last_line;

             }
            
            ;

alias:
            AS IDENTIFIER {
                $$ = createAlias(yy, @1, @2, createKeyword(yy, @1, @1, $1), createIdentifier(yy, @2, @2, $2));
            }
            |

            ;

single_param:
            PARAM_PREFIX BLOCK_VALUE_PRIMITIVE {                
                $$ = createSettingsBlockArg(yy, @1, @2, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @2, @2, $2));
            }
            |
;

/* block_type "level1" "level2" ...
or block_type "level"
*/
hierarchy_levels:
             ASCII_STRING hierarchy_levels {
                var sbPathPart = createLiteral(yy, @1, @1, $1);                
                $$ = [sbPathPart];
                if($2) {
                   $$ = $$.concat($2);
                }                
             }
            | ASCII_STRING {
                var sbPathPart = createLiteral(yy, @1, @1, $1);                
                $$ = [sbPathPart];
            }     

            ;

// block_new "name" from block_category1.block_name1, block_category2.block_name2...
parent_block_list:
            // parent block name can be either an alias identifier or full path
            IDENTIFIER COMMA_SEPARATOR parent_block_list {               
                $$ = createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
                if($3) {
                    $$.push($3[0]);
                }
            }
            | PARENT_BLOCK COMMA_SEPARATOR parent_block_list {              
                $$ = createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
                if($3) {
                    $$.push($3[0]);
                }
            }
            | PARENT_BLOCK {
                $$ = createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
            }
            | IDENTIFIER {
                $$ = createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
            }

            ;

param_list:
            PARAM {
                $$ = createSettingsBlockParam(yy, @1, @1, $1);
                $$ = [$$];
            }
            | PARAM COMMA_SEPARATOR param_list {
                $$ = createSettingsBlockParam(yy, @1, @1, $1);
                $$ = [$$];
                if($3) {
                   $$ = $$.concat($3);
                   @$.last_line = @3.last_line;
                   @$.last_column = @3.last_column;
                }
            }

            ;

// @param1=1, @param2="", ....
param_value_list:
            PARAM EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR param_value_list {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR list {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), $3);                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR list COMMA_SEPARATOR param_value_list {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), $3);                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR ASCII_STRING {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR param_value_list {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR PARENT_BLOCK {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createJsonExpression(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR param_value_list {
                $$ = createSettingsBlockArg(yy, @1, @3, createSettingsBlockParam(yy, @1, @1, $1), createJsonExpression(yy, @3, @3, $3));                
                $$ = [$$];             
                if($5) {
                    $$ = $$.concat($5);
                }
            }

            ;

// match the block value
settings_block_value:
                    // the value could be a primitive (integer, boolean, float)
                    BLOCK_VALUE_PRIMITIVE { 
                        $$ = createLiteral(yy, @1, @1, $1);
                    }
                    | list {                           
                        $$ = $1;
                    }
                    | config_block {
                        // sb value declaration                        
                        $$ = $1;
                    }

            ;

settings_table_values:
                    ASCII_STRING EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE {
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | ASCII_STRING EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values {                         
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }             
                    }
                    | ASCII_STRING EQUAL_OPERATOR ASCII_STRING {     
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | ASCII_STRING EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values {       
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                       
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE {
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values {    
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                          
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING {
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values {       
                        $$ = createSettingsBlockArg(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                      
                    }


            ;

// match complex configuration block
config_block: BLOCK_VALUE_COMPLEX_START config_block_content BLOCK_VALUE_COMPLEX_END {
                $$ = createSettingsBlockComplexValue(yy, @1, @3);
                $$.addElements($2);
                @$.first_line = @1.first_line;
                @$.first_column = @1.first_column;
                @$.last_line = @3.last_line;
                @$.last_column = @3.last_column;                
            }
            | BLOCK_VALUE_COMPLEX_START BLOCK_VALUE_COMPLEX_END {
                $$ = createSettingsBlockComplexValue(yy, @1, @2);
                @$.first_line = @1.first_line;
                @$.first_column = @1.first_column;
                @$.last_line = @2.last_line;
                @$.last_column = @2.last_column;
            }
            ;

// complex block value definition
config_block_content:
            // key = value
            IDENTIFIER EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }           
            // key1 = value, key2 = value
            | IDENTIFIER EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR config_block_content {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            // key = @Param
            | IDENTIFIER EQUAL_OPERATOR PARAM {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createSettingsBlockParam(yy, @3, @3, $3));
                $$ = [$$];
            }
            // key = @Param, ...
            | IDENTIFIER EQUAL_OPERATOR PARAM COMMA_SEPARATOR config_block_content {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createSettingsBlockParam(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$  = $$.concat($5);
                }
            }
            | IDENTIFIER EQUAL_OPERATOR ASCII_STRING {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                $$ = [$$];
            } 
            | IDENTIFIER EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR config_block_content {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createLiteral(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            } 
            // key = []
            | IDENTIFIER EQUAL_OPERATOR list {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
            } // key = [1,2,3], ...
            | IDENTIFIER EQUAL_OPERATOR list COMMA_SEPARATOR config_block_content {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            // key = {...} 
            | IDENTIFIER EQUAL_OPERATOR config_block {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
            }
            // key = {...}, key = value
            | IDENTIFIER EQUAL_OPERATOR config_block COMMA_SEPARATOR config_block_content {
               $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), $3);
               $$ = [$$];
               if($5) {
                   $$ = $$.concat($5);
               }
            }
            | list_settings_subblock {
                // TODO check if this solution is clean
                $$ = $1;
            }
            | IDENTIFIER EQUAL_OPERATOR PARENT_BLOCK {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createJsonExpression(yy, @3, @3, $3));
                $$ = [$$];
            }
            | IDENTIFIER EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR config_block_content {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @3, createIdentifier(yy, @1, @1, $1), createJsonExpression(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                   $$ = $$.concat($5); 
               }
            }

            ;

// list
list:
            OPEN_BRACKET list_elements CLOSE_BRACKET {
                $$ = createArrayExpression(yy, @1, @3);   
                $$.addElements($2);                
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @3.last_column;
                @$.last_line = @3.last_line; 
            }
            // empty list
            | OPEN_BRACKET CLOSE_BRACKET {
                $$ = createArrayExpression(yy, @1, @2); 
                @$.last_column = @2.last_column;
                @$.last_line = @2.last_line;    
            }

            ;

// elements list => element1,element2
list_elements:
            list_element {
                $$ = [$1];
            }
            | list_element COMMA_SEPARATOR list_elements {
                $$ = [$1];
                if($3) {
                   $$ = $$.concat($3);
                }
            }

            ;

// list single element
list_element:
            BLOCK_VALUE_PRIMITIVE {
                $$ = createLiteral(yy, @1, @1, $1);                
            }
            | ASCII_STRING {
                $$ = createLiteral(yy, @1, @1, $1);
            }
            | list {
                $$ = $1;
            }
            | config_block {          
                $$ = $1;
            }
            | PARENT_BLOCK {
                $$ = createJsonExpression(yy, @1, @1, $1);                         
            }
            ;

list_settings_subblock:
            settings_block list_settings_subblock {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @1, createIdentifier(yy, @1, @1, null), $1);  
                $$ = [$$];
                if($2) {
                    $$ = $$.concat($2);
                }
            }
            | settings_block {
                $$ = createSettingsBlockPropertyDeclarator(yy, @1, @1, createIdentifier(yy, @1, @1, null), $1);  
                $$ = [$$];
            }

            ;

/* import file definition take file1,file2 */
import_block:
            // take file1,...
            TAKE_DECLARATION import_list {
                // create keyword node
                var keywordNode = createKeyword(yy, @1, @1, $1);
                // create import array expression node
                var importArrayExpressionNode = createArrayExpression(yy, @2, @2);
                importArrayExpressionNode.addElements($2);
                // create import declaration
                var importDeclartion = createImportDeclaration(yy, @1, @2, keywordNode, importArrayExpressionNode);

                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @2.last_column;
                @$.last_line = @2.last_line;            
                $$ = importDeclartion;               
            }

            ;

// list of imported configuration files
import_list:
            FILE_NAME IMPORT_SEPARATOR import_list {  
                var importFileNode = createImportFile(yy, @1, @1, $1);                            
                $$ = [importFileNode];
                if($3) {
                  @$.first_column = @1.first_column;
                  @$.first_line = @1.first_line;
                  @$.last_column = @3.last_column;
                  @$.last_line = @3.last_line;
                  $$ = $$.concat($3);
                }              
            }
            | FILE_NAME {
                var importFileNode = createImportFile(yy, @1, @1, $1);                             
                $$ = [importFileNode];
            }

            ;
%%

// create ConfigurationFile instance
function createConfigurationFile(yy, startLoc, endLoc) {
    return new yy.ConfigurationFile(yy.ConfigurationFile.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
}

// create Keyword instance
function createKeyword(yy, startLoc, endLoc, keyword) {
    return new yy.Keyword(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword
    );
}

// create literal
function createLiteral(yy, startLoc, endLoc, data) {
    return new yy.Literal(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            data
    );
}

// create a new instance of ArrayExpression
function createArrayExpression(yy, startLoc, endLoc) {
    return new yy.ArrayExpression(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line)
    );
}

function createTable(yy, startLoc, endLoc, keyword, values) {
    return new yy.Table(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword, values
    );
}

function createIdentifier(yy, startLoc, endLoc, identifier) {
    return new yy.Identifier(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            identifier
    );
}

function createSettingsBlockParam(yy, startLoc, endLoc, Param) {
    return new yy.Param(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            Param
    );
}

function createSettingsBlockArg(yy, startLoc, endLoc, arg, value) {
    return new yy.Arg(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            arg,
            value
    );
}

function createAlias(yy, startLoc, endLoc, keyword, identifier) {
    return new yy.Alias(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword,
            identifier
    );
}

function createJsonExpression(yy, startLoc, endLoc, expression) {
    return new yy.JSONPathExpression(
           yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
           expression     
    );
}

// create ImportDeclaration instance
function createImportDeclaration(yy, startLoc, endLoc, keyword, importedFiles) {
    return new yy.ImportDeclaration(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            keyword, 
            importedFiles
    );
}

function createSettingsBlockPropertyDeclarator(yy, startLoc, endLoc, identifier, value) {
    return new yy.PropertyDeclarator(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
        identifier, value
    );
}

function createSettingsBlockComplexValue(yy, startLoc, endLoc) {
    return new yy.ComplexValue(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
}

function createSettingsBlockInheritanceDeclaration(yy, startLoc, endLoc, keyword, inheritance) {
    return new yy.InheritanceDeclaration(
        yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
        keyword, 
        inheritance
    );
}

function createSettingsblockInheritance(yy, startLoc, endLoc, path) {
    return new yy.Inheritance(
        yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
        path
    );
}


function createImportFile(yy, startLoc, endLoc, file) {
    return new yy.Dependency(
            yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            file
    );
}

function createBundle(yy, startLoc, endLoc, identifier, ns) {
    return new yy.Bundle(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line),
            identifier, ns
    );
}

function createSettingsBlockDeclaration(yy, startLoc, endLoc) {
    return new yy.SettingsBlockDeclaration(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, startLoc.first_column, startLoc.first_line, endLoc.last_column, endLoc.last_line));
}


function createEOF(yy, endLoc) {
    return new yy.EOF(yy.ImportDeclaration.BuildContextWith(yy.fileURI, yy.fileHash, endLoc.last_column, endLoc.last_line, endLoc.last_column, endLoc.last_line));
}