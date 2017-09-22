'use strict';

import {ObjUtils} from '../../../dist/core/utils/objUtils';
import {assert} from 'chai';

describe('Unit::ObjUtils library', function () {

    it('should create a multilevel property with an arr property path', function () {
        let actualObj: any = {};
        let propertyVal = 2;
        let propertyPath = ['level1', 'level2', 'level3'];
        ObjUtils.createMultilevelProperty(actualObj, propertyPath, propertyVal);
        assert.deepEqual({"level1": {"level2": {"level3": propertyVal}}}, actualObj);
    });

    it('should create a multilevel property with a dot notation style path', function () {
        let actualObj: any = {};
        let propertyVal = 2;
        let propertyPath = 'level1.level2.level3';
        ObjUtils.createMultilevelProperty(actualObj, propertyPath, propertyVal);
        assert.deepEqual({"level1": {"level2": {"level3": propertyVal}}}, actualObj);
    });

    it('should not create a multilevel property with an empty string', function () {
        let actualObj: any = {};
        ObjUtils.createMultilevelProperty(actualObj, '', 2);
        assert.deepEqual({}, actualObj);
    });

    it('should not create a multilevel property with an empty arr', function () {
        let actualObj: any = {};
        ObjUtils.createMultilevelProperty(actualObj, [], 2);
        assert.deepEqual({}, actualObj);
    });

    it('should read a multilevel property with an arr property path', function () {
        let actualObj = {
            key: {
                value: 2
            }
        };
        assert.equal(ObjUtils.getMultilevelProperty(actualObj, 'key.value'), 2);
    });

    it('should read a multilevel property with a dot notation style path', function () {
        let actualObj = {
            key: {
                value: 2
            }
        };
        assert.equal(ObjUtils.getMultilevelProperty(actualObj, ['key', 'value']), 2);
    });

    it('should replace all object properties\' values with the args/values provided', function () {
        // mysql connection
        const mysqlSettingsBlockTemplate = {
            username: "@username",
            password: "@password",
            host: "@host",
            port: "@port",
            is_local: "@is_local",
            description: "the username is @username and host used is @host",
            extra: ["@bind-to-localhost"]

        };
        // some const values
        const username = 'mysql';
        const password = 'mysql_pass';
        const host = '127.0.0.1';
        const port = 3306;
        const is_local = true;
        // generate a new settings block with the provided args/values based on the settings block template
        const generatedMysqlSettingsBlock = ObjUtils.multilevelReplace(mysqlSettingsBlockTemplate, {
            "@username": username,
            "@password": password,
            "@host": host,
            "@port": port,
            "@is_local": is_local,
            "@bind-to-localhost": is_local
        });
        // this is the expected final settings block
        const expectedMysqlConnection = {
            username: username,
            password: password,
            host: host,
            port: port,
            is_local: is_local,
            description: 'the username is ' + username + ' and host used is ' + host,
            extra: [is_local]
        };

        assert.deepEqual(generatedMysqlSettingsBlock, expectedMysqlConnection);

    });

    it('should delete all the empty items', function () {
        let actualObj = {
            emptyProperty: {},
            subEmptyProperty: {
                emptyProperty: {},
                item: 2
            },
            arrayWithEmptyProperty: [{}, 2, 3, null],
            emptyArray: [],
            nullElement: null
        };
        let expectedObj: any = {
            subEmptyProperty:
                {item: 2},
            arrayWithEmptyProperty: [2, 3]
        };
        ObjUtils.clearEmpties(actualObj, true, true, true);
        assert.deepEqual(actualObj, expectedObj);
    });


});