import * as extend from 'extend';
import * as crypto from 'crypto';
import * as objectPath from 'object-path';
import escapeStringRegexp = require('escape-string-regexp');


export class ObjUtils {

    /**
     * Create multilevel setting property
     * @Param obj parent object
     * @Param keyPath key property Path represented by an array
     * @Param value value of the key
     * @returns {*}
     */
    static createMultilevelProperty(obj: object, keyPath: Array<string> | string, value: any) {

        let currentObject: object = obj;

        if (keyPath == undefined || (keyPath.length === 0 && typeof value !== 'object')) {
            return obj;
        }

        if (typeof keyPath === 'string') {
            keyPath = keyPath.split('.');
        }

        if (keyPath.length === 0 && typeof value === 'object') {
            extend(obj, value);
        } else {

            keyPath.forEach((key: string, i: number) => {
                // getCachedValue key name
                //let key = keyPath[i];
                if (!(key in currentObject)) {
                    (<any>currentObject)[key] = {};
                }
                if (i == (keyPath.length - 1)) {

                    /*if (key == '_') {
                        if (!((typeof value === 'number'
                                || typeof value === 'boolean'
                                || typeof value === 'string'
                                || Array.isArray(value)))) {
                            extend((<any>currentObject), value)
                        }
                    } else {*/
                    (<any>currentObject)[key] = (typeof value === 'number'
                        || typeof value === 'boolean'
                        || typeof value === 'string'
                        || Array.isArray(value)) ? value
                        : extend((<any>currentObject)[key], value);
                    //}
                }
                // go deeper
                currentObject = /*key == '_' ? (<any>currentObject) :*/ (<any>currentObject)[key];

            });
        }

        return obj;
    }

    /**
     * Retrieve a property value from {@Param obj} based on a provided Path {@Param path}
     * @Param obj the object that we are going to extract the property value from
     * @Param path this can be either written in dot notation style e.g. myproperty.mysubproperty...
     * or in array form e.g. [myproperty, mysubproperty]
     * @returns {*}
     */
    static getMultilevelProperty(obj: object, path: Array<string> | string) {
        return objectPath.get(obj, path);
    }

    /**
     * Replace all {@Param args} occurrences with their corresponding values
     * @Param obj json object
     * @Param args object that contains all the params and their values {@param1:value1, @param2:value2}
     * @returns {*}
     */
    static multilevelReplace(obj: any, args: any) {
        if (args && obj && typeof obj === 'object') {
            // iterate through settings block properties and update values
            for (let key in obj) {
                for (let argKey in args) {
                    if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
                        /**********************************************************************************************
                         If the argument value is primitive and the argument name is alone on the right side
                         then we remove the quote to preserve the argument value type
                         e.g.
                         mixin_block @param1...{
                            key1 = @param1,
                            key2 = "param1 is equal to @param1"
                         }
                         ... apply mixin_block @param1=2
                         this generates
                         ... {                                                  {
                                key1 = 2,                           and not           key1 = "2",
                                key2 = "param1 is equal to 2"                         key2 = "param1 is equal to 2"
                          }                                                     }
                         *********************************************************************************************/
                        if (obj[key] == argKey
                            && args.hasOwnProperty(argKey)
                            && (typeof args[argKey] === 'number' || typeof args[argKey] === 'boolean' || typeof args[argKey] === 'object')) {
                            obj[key] = args[argKey];
                        } else {
                            // replace all arg occurrences with it's value
                            obj[key] = obj[key].replace(new RegExp(escapeStringRegexp(argKey), 'g'), args[argKey]);
                        }
                    } else if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                        ObjUtils.multilevelReplace(obj[key], args);
                    }
                }
            }
        }
        return obj;
    }

    static multilevelSet(obj: any, args: any) {
        for (let argKey in args) {
            if (args.hasOwnProperty(argKey)) {
                let argName = argKey.replace('@@', '');
                let argVal = args[argKey];
                objectPath.set(obj, argName, argVal);
            }
        }
    }

    static simpleMultilevelSet(obj: any, path: string | Array<string>, val: any) {
        objectPath.set(obj, path, val);
    }

    /**
     *
     * @Param obj
     * @Param {boolean} removeEmptyObj
     * @Param {boolean} removeEmptyArr
     * @Param {boolean} removeNullValue
     */
    static clearEmpties(obj: any, removeEmptyObj: boolean, removeEmptyArr: boolean, removeNullValue: boolean) {

        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] !== 'object') {
                    continue // If null or not an object, skip to the next iteration
                }
                // The property is an object
                ObjUtils.clearEmpties(obj[property], removeEmptyObj, removeEmptyArr, removeNullValue);
                if ((removeNullValue && !obj[property]) || Object.keys(obj[property]).length === 0) {
                    if (Array.isArray(obj) && removeEmptyArr) {
                        obj.splice(Number(property), 1);
                    } else {
                        if (typeof obj[property] === 'object' && !removeEmptyObj)
                            continue;
                        delete obj[property]; // The object had no properties, so delete that property
                    }
                }
            }
        }
    }

    /**
     * delete
     * @Param {any} obj
     * @Param {Array<String> | string} path
     * @returns {boolean}
     */
    static multilevelDelete(obj: any, path: string) {
        objectPath.del(obj, path);
    }

    /**
     * md5 hash
     * @Param {string} str
     * @returns {string}
     */
    static hash(str: string) {
        let md5sum = crypto.createHash('md5');
        md5sum.update(str);
        return md5sum.digest('hex');
    }

    /**
     * Sort JSON object keys
     * @returns {any}
     * @Param object
     */
    static sortObject(object: any) {

        let sortedObj: any = {};
        let keys = Object.keys(object);

        keys.sort(function (key1, key2) {
            key1 = key1.toLowerCase();
            key2 = key2.toLowerCase();
            if (key1 < key2) return -1;
            if (key1 > key2) return 1;
            return 0;
        });

        for (let key of keys) {
            if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
                sortedObj[key] = ObjUtils.sortObject(object[key]);
            } else {
                sortedObj[key] = object[key];
            }
        }

        return sortedObj;
    }

}

