import {readFile} from 'fs';

export class FileUtils {

    /**
     * Promised based version of the built-in nodejs.readFile
     * based on {@link http://exploringjs.com/es6/ch_promises.html#readFilePromisified}
     * @Param filename the complete fileHash path
     * @returns {Promise}
     */
    static readFilePromisified(filename: string) {
        return new Promise(
            function (resolve: any, reject: any) {
                readFile(filename, {encoding: 'utf8'},
                    (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
    }
}