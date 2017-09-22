#!/usr/bin/env bash
# generate the grammar.ts file
jison2json ./src/compiler/grammar/grammar.yy | (read; cat) | cat <(printf "// AUTO GENERATED from the grammar.yy. DO NOT MODIFY !\r\n// This file is embedded in the npm package for an easy delivery \r\n\r\nexport const Grammar:string = JSON.stringify(") <(cat -) <(echo ");") > ./src/compiler/grammar/grammar.generated.ts
