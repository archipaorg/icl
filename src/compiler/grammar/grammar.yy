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
                    $$ = yy.Helper.createConfigurationFile(yy, @1, @1);
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
                    $$ = yy.Helper.createEOF(yy, @$);
                }
            ;

/* basic block definition block_type "name" value */
settings_block: 
              // match block id + block name eg: variable "var1" 1
             IDENTIFIER hierarchy_levels alias settings_block_value {
                // create identifier 
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                // create setting block declaration node
                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @4);
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
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                var inheritanceNode = yy.Helper.createArrayExpression(yy, @5, @5);                
                inheritanceNode.addElements($5);
                // create inheritance
                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @4, @5, yy.Helper.createKeyword(yy, @4, @4, $4), inheritanceNode);
                // get Param

                // create setting block declaration node
                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @7);
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
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);

                // create alias
                var aliasNode = $3;

                var inheritanceNode = yy.Helper.createArrayExpression(yy, @6, @6);
                inheritanceNode.addElements($6);
                // create inheritance
                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @5, @6, yy.Helper.createKeyword(yy, @5, @5, $5), inheritanceNode);
                // get Param
                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @4, @4);
                paramsArrayExpression.addElements($4);
                // create setting block declaration node
                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @8);
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
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);
                var inheritanceNode = yy.Helper.createArrayExpression(yy, @4, @4);
                //console.log(inheritanceNode.id);
                inheritanceNode.addElements($4);
                //console.log(inheritanceNode.elements[0].parent.id);
                // create inheritance
                var inheritanceDeclaratorNode = yy.Helper.createSettingsBlockInheritanceDeclaration(yy, @3, @4, yy.Helper.createKeyword(yy, @3, @3, $3), inheritanceNode);
                // get Param
                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @5, @5);
                paramsArrayExpression.addElements($5);
                // create setting block declaration node
                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);
                $$.bundle = bundleNode;
                $$.inheritFrom = inheritanceDeclaratorNode;
                var argsValues = yy.Helper.createArrayExpression(yy, @5, @5);
                argsValues.addElements($5);
                $$.initWith = argsValues;
  
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @5.last_column;
                @$.last_line = @5.last_line;
             }
             | IDENTIFIER hierarchy_levels alias param_list settings_block_value {
                 // create identifier 
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);
                // create alias
                var aliasNode = $3;
                // get Param
                var paramsArrayExpression = yy.Helper.createArrayExpression(yy, @4, @4);
                paramsArrayExpression.addElements($4);
                // create setting block declaration node
                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);
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
                var identifierNode = yy.Helper.createIdentifier(yy, @1, @1, $1);
                // create namespace 
                var namespaceNode = yy.Helper.createArrayExpression(yy, @2, @2, $2);
                namespaceNode.addElements($2);
                // create bundle
                var bundleNode = yy.Helper.createBundle(yy, @1, @2, identifierNode, namespaceNode);
                // create alias
                var aliasNode = $3;
                
                var tableValues = yy.Helper.createArrayExpression(yy, @5, @5, $5);
                tableValues.addElements($5);
                var valuesNodes = yy.Helper.createTable(yy, @5, @5, yy.Helper.createKeyword(yy, @4, @4, $4), tableValues);

                $$ = yy.Helper.createSettingsBlockDeclaration(yy, @1, @5);
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
                $$ = yy.Helper.createAlias(yy, @1, @2, yy.Helper.createKeyword(yy, @1, @1, $1), yy.Helper.createIdentifier(yy, @2, @2, $2));
            }
            |

            ;

single_param:
            PARAM_PREFIX BLOCK_VALUE_PRIMITIVE {                
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @2, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @2, @2, $2));
            }
            |
;

/* block_type "level1" "level2" ...
or block_type "level"
*/
hierarchy_levels:
             ASCII_STRING hierarchy_levels {
                var sbPathPart = yy.Helper.createLiteral(yy, @1, @1, $1);                
                $$ = [sbPathPart];
                if($2) {
                   $$ = $$.concat($2);
                }                
             }
            | ASCII_STRING {
                var sbPathPart = yy.Helper.createLiteral(yy, @1, @1, $1);                
                $$ = [sbPathPart];
            }     

            ;

// block_new "name" from block_category1.block_name1, block_category2.block_name2...
parent_block_list:
            // parent block name can be either an alias identifier or full path
            IDENTIFIER COMMA_SEPARATOR parent_block_list {               
                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
                if($3) {
                    $$.push($3[0]);
                }
            }
            | PARENT_BLOCK COMMA_SEPARATOR parent_block_list {              
                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
                if($3) {
                    $$.push($3[0]);
                }
            }
            | PARENT_BLOCK {
                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
            }
            | IDENTIFIER {
                $$ = yy.Helper.createSettingsblockInheritance(yy, @1, @1, $1);
                $$ = [$$];
            }

            ;

param_list:
            PARAM {
                $$ = yy.Helper.createSettingsBlockParam(yy, @1, @1, $1);
                $$ = [$$];
            }
            | PARAM COMMA_SEPARATOR param_list {
                $$ = yy.Helper.createSettingsBlockParam(yy, @1, @1, $1);
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
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR param_value_list {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR list {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), $3);                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR list COMMA_SEPARATOR param_value_list {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), $3);                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR ASCII_STRING {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR param_value_list {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            | PARAM EQUAL_OPERATOR PARENT_BLOCK {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));                
                $$ = [$$];
            }
            | PARAM EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR param_value_list {
                $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createSettingsBlockParam(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));                
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
                        $$ = yy.Helper.createLiteral(yy, @1, @1, $1);
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
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | ASCII_STRING EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values {                         
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }             
                    }
                    | ASCII_STRING EQUAL_OPERATOR ASCII_STRING {     
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | ASCII_STRING EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values {       
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                       
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE {
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR settings_table_values {    
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                          
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING {
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                    }
                    | BLOCK_VALUE_PRIMITIVE EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR settings_table_values {       
                        $$ = yy.Helper.createSettingsBlockArg(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                        $$ = [$$];
                        if($5) {
                            $$ = $$.concat($5);
                        }                      
                    }


            ;

// match complex configuration block
config_block: BLOCK_VALUE_COMPLEX_START config_block_content BLOCK_VALUE_COMPLEX_END {
                $$ = yy.Helper.createSettingsBlockComplexValue(yy, @1, @3);
                $$.addElements($2);
                @$.first_line = @1.first_line;
                @$.first_column = @1.first_column;
                @$.last_line = @3.last_line;
                @$.last_column = @3.last_column;                
            }
            | BLOCK_VALUE_COMPLEX_START BLOCK_VALUE_COMPLEX_END {
                $$ = yy.Helper.createSettingsBlockComplexValue(yy, @1, @2);
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
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));                
                $$ = [$$];
            }           
            // key1 = value, key2 = value
            | IDENTIFIER EQUAL_OPERATOR BLOCK_VALUE_PRIMITIVE COMMA_SEPARATOR config_block_content {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            // key = @Param
            | IDENTIFIER EQUAL_OPERATOR PARAM {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createSettingsBlockParam(yy, @3, @3, $3));
                $$ = [$$];
            }
            // key = @Param, ...
            | IDENTIFIER EQUAL_OPERATOR PARAM COMMA_SEPARATOR config_block_content {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createSettingsBlockParam(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$  = $$.concat($5);
                }
            }
            | IDENTIFIER EQUAL_OPERATOR ASCII_STRING {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                $$ = [$$];
            } 
            | IDENTIFIER EQUAL_OPERATOR ASCII_STRING COMMA_SEPARATOR config_block_content {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createLiteral(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            } 
            // key = []
            | IDENTIFIER EQUAL_OPERATOR list {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
            } // key = [1,2,3], ...
            | IDENTIFIER EQUAL_OPERATOR list COMMA_SEPARATOR config_block_content {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
                if($5) {
                    $$ = $$.concat($5);
                }
            }
            // key = {...} 
            | IDENTIFIER EQUAL_OPERATOR config_block {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);
                $$ = [$$];
            }
            // key = {...}, key = value
            | IDENTIFIER EQUAL_OPERATOR config_block COMMA_SEPARATOR config_block_content {
               $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), $3);
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
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));
                $$ = [$$];
            }
            | IDENTIFIER EQUAL_OPERATOR PARENT_BLOCK COMMA_SEPARATOR config_block_content {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @3, yy.Helper.createIdentifier(yy, @1, @1, $1), yy.Helper.createJsonExpression(yy, @3, @3, $3));
                $$ = [$$];
                if($5) {
                   $$ = $$.concat($5); 
               }
            }

            ;

// list
list:
            OPEN_BRACKET list_elements CLOSE_BRACKET {
                $$ = yy.Helper.createArrayExpression(yy, @1, @3);   
                $$.addElements($2);                
                @$.first_column = @1.first_column;
                @$.first_line = @1.first_line;
                @$.last_column = @3.last_column;
                @$.last_line = @3.last_line; 
            }
            // empty list
            | OPEN_BRACKET CLOSE_BRACKET {
                $$ = yy.Helper.createArrayExpression(yy, @1, @2); 
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
                $$ = yy.Helper.createLiteral(yy, @1, @1, $1);                
            }
            | ASCII_STRING {
                $$ = yy.Helper.createLiteral(yy, @1, @1, $1);
            }
            | list {
                $$ = $1;
            }
            | config_block {          
                $$ = $1;
            }
            | PARENT_BLOCK {
                $$ = yy.Helper.createJsonExpression(yy, @1, @1, $1);                         
            }
            ;

list_settings_subblock:
            settings_block list_settings_subblock {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @1, yy.Helper.createIdentifier(yy, @1, @1, null), $1);  
                $$ = [$$];
                if($2) {
                    $$ = $$.concat($2);
                }
            }
            | settings_block {
                $$ = yy.Helper.createSettingsBlockPropertyDeclarator(yy, @1, @1, yy.Helper.createIdentifier(yy, @1, @1, null), $1);  
                $$ = [$$];
            }

            ;

/* import file definition take file1,file2 */
import_block:
            // take file1,...
            TAKE_DECLARATION import_list {
                // create keyword node
                var keywordNode = yy.Helper.createKeyword(yy, @1, @1, $1);
                // create import array expression node
                var importArrayExpressionNode = yy.Helper.createArrayExpression(yy, @2, @2);
                importArrayExpressionNode.addElements($2);
                // create import declaration
                var importDeclartion = yy.Helper.createImportDeclaration(yy, @1, @2, keywordNode, importArrayExpressionNode);

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
                var importFileNode = yy.Helper.createImportFile(yy, @1, @1, $1);                            
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
                var importFileNode = yy.Helper.createImportFile(yy, @1, @1, $1);                             
                $$ = [importFileNode];
            }

            ;
%%

