import {assert} from 'chai';
import {ICLCompiler} from '../../../dist/compiler/iclCompiler';
import {FsResource} from '../../../dist/compiler/resource/fsResource';
import {ResourceManager} from '../../../dist/compiler/resource/resourceManager';
import {ConfigurationFile} from '../../../dist/core/ast/configurationFile';
import {using} from '../../../dist/core/types/common';
import {IWatcher} from '../../../dist/core/types/resource';
import {FsWatcher} from '../../../src/compiler/resource/fsWatcher';

describe('Int::Native ICL Parser', function () {

    let parser: ICLCompiler = new ICLCompiler();

    before(function (done) {
        done();
    });

    after(function () {
        // runs after all test in this block
    });

    beforeEach(function () {
        // runs before each test in this block
    });

    afterEach(function () {
        // runs after each test in this block
    });

    it('should parse correctly a sample of mysql configuration fileHash', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/database/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    const expectedParsedCfg: any = {
                        "database": {
                            "generic": {"version": 2},
                            "generic2": {"config": "ok"},
                            "connection": {
                                "config": "ok",
                                "version": 2,
                                "username": "@username",
                                "password": "@password",
                                "port": "@port",
                                "host": "@host",
                                "extra": {"description": "username is mysql and password is mysql"}
                            },
                            "mysql": {
                                "config": "ok",
                                "version": 2,
                                "username": "mysql",
                                "password": "mysql",
                                "port": 3306,
                                "host": "127.0.0.1",
                                "extra": {"description": "username is mysql and password is mysql"}
                            }
                        }
                    };
                    assert.deepEqual(actualCfg, expectedParsedCfg);
                });
            });
        });
    });

    it('should parse correctly a sample of i18n configuration fileHash', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/i18n/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    const expectedParsedCfg: any = {
                            "translate": {
                                "default": {
                                    "title": "How to i18n your app ?",
                                    "text": "Unless your app is strictly local in scope, you should internationalize it,\n    making it easy to adapt to various languages and regions. You can then localize it—translate and otherwise adapt it so that it works well in a particular locale.\n    You can internationalize your app even if it initially supports just one locale.\n    For example, you might initially publish your app in English (locale code: \"en\").\n    Then, after a few weeks or months,\n    you might add support for additional locales such as French (locale code: \"fr\")\n    and Arabic (locale code: \"ar\").",
                                    "version": 3
                                },
                                "fr": {
                                    "title": "Comment internationaliser son application ?",
                                    "text": "À moins que votre application ne soit strictement locale, vous devriez l'internationaliser,\n             Ce qui facilite l'adaptation aux différentes langues et régions. Vous pouvez ensuite le localiser: traduit et adaptez-le de sorte qu'il fonctionne bien dans un lieu particulier.\n             Vous pouvez internationaliser votre application même s'il supporte initialement une seule locale.\n             Par exemple, vous pouvez d'abord publier votre application en anglais (code local: \"en\").\n             Ensuite, après quelques semaines ou quelques mois,\n             Vous pouvez ajouter un support pour des paramètres régionaux supplémentaires tels que le français (code local: \"fr\")\n             Et arabe (code local: \"ar\")",
                                    "version": 3
                                },
                                "es": {
                                    "title": "Cómo internacionalizar su aplicación?",
                                    "text": "A menos que su aplicación es estrictamente local, debe internacionalizarse,\n                                 Esto facilita la adaptación a diferentes idiomas y regiones. A continuación, puede localizar: traducir y adaptarlo para que funcione bien en un lugar determinado.\n                                 Puede internacionalizar su aplicación incluso si inicialmente sólo admite una configuración regional.\n                                 Por ejemplo, puede publicar su primera aplicación en Inglés (código local, \"en\").\n                                 Entonces, después de unas pocas semanas o meses,\n                                 Puede añadir soporte para las configuraciones regionales adicionales, como el francés (código local \"en\")\n                                 Y el árabe (código local: \"ar\")",
                                    "version": 3
                                }
                            }
                        }
                    ;
                    assert.deepEqual(actualCfg, expectedParsedCfg);
                });
            });
        });
    });

    it('shoud parse correctly a custom blocks sample', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/custom_blocks/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    let expectedParsedCfg: any = {
                        "git": {
                            "url": "https://github.com",
                            "pull": true,
                            "retry": 2

                        },
                        "mywebapp": {
                            "dns": {
                                "name": "task",
                                "type": "web",
                                "local": "127.0.0.1",
                                "localhost": "127.0.0.1"
                            },
                            "configuration": {
                                "environment": {
                                    "commit_tx": true,
                                    "init_on_start": true
                                }
                            },
                            "max": 8096,
                            "min": 1024,
                            "name": "webapp",
                            "type": "web"
                        },
                        "job": {
                            "db_backup": {
                                "url": "https://github.com"
                            }
                        },
                        "network": {
                            "dns": {
                                "alias": {
                                    "alias-service-cassandra": "cassandra",
                                    "alias-service-solr": "solr-bly",
                                    "nalias-service-geo": "bly-geo"
                                }
                            }
                        },
                        "tags": [
                            "frontend"
                        ],
                        "apiKey": "abcde"
                    };
                    assert.deepEqual(actualCfg, expectedParsedCfg);
                });
            });
        });
    });

    it('should ignore duplicate imports', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/custom_blocks/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    let expectedParsedCfg: any = {
                        "git": {
                            "url": "https://github.com",
                            "pull": true,
                            "retry": 2

                        },
                        "mywebapp": {
                            "dns": {
                                "name": "task",
                                "type": "web",
                                "local": "127.0.0.1",
                                "localhost": "127.0.0.1"
                            },
                            "configuration": {
                                "environment": {
                                    "commit_tx": true,
                                    "init_on_start": true
                                }
                            },
                            "max": 8096,
                            "min": 1024,
                            "name": "webapp",
                            "type": "web"
                        },
                        "job": {
                            "db_backup": {
                                "url": "https://github.com"
                            }
                        },
                        "network": {
                            "dns": {
                                "alias": {
                                    "alias-service-cassandra": "cassandra",
                                    "alias-service-solr": "solr-bly",
                                    "nalias-service-geo": "bly-geo"
                                }
                            }
                        },
                        "tags": [
                            "frontend"
                        ],
                        "apiKey": "abcde"
                    };
                    assert.deepEqual(actualCfg, expectedParsedCfg);
                });
            });
        });
    });

    it('should throw an error', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/custom_blocks/bundle_error.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    try {
                        parser.compile(iclResource);
                        assert.isNotOk(true);
                    } catch (e) {
                        assert.ok(true);
                    }
                });
            });
        });
    });


    it('should accept replace and setCacheManager params', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/mixins/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    let expectedCfg: any = {
                        "variable": {
                            "port": {
                                "annotations": {
                                    "description": "some annotations",
                                    "protocol": "protocol is http"
                                },
                                "description": "nginx http port",
                                "name": "http",
                                "port": 80
                            }
                        }
                    };
                    assert.deepEqual(actualCfg, expectedCfg);
                });
            });
        });
    });


    it('should not fire an error', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/bug_tojson/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource);
                    let expectedCfg: any = {};
                    // assert.deepEqual(actualCfg.ast[0], expectedCfg);
                });
            });
        });
    });

    it('should perform all interpolations', function () {
        using(new ResourceManager(), (resourceManager) => {
            using(new FsWatcher(), (watcher) => {
                using(new FsResource<string, ConfigurationFile>('./test-fixtures/interpolation/bundle.icl'), (iclResource) => {
                    iclResource.setCacheManager(resourceManager);
                    iclResource.setWatcher(<IWatcher>watcher);
                    let actualCfg = parser.compile(iclResource).compiled;
                    let expectedCfg: any = {
                        "http-port": {
                            "key": 2,
                            "parentKey": 2,
                            "testKey": {
                                "test": 2
                            }
                        }
                    };
                    assert.deepEqual(actualCfg, expectedCfg);
                });
            });
        });
    });

    /*it('should parser a table of mixed element', function () {
         let actualCfg = Parser.parse('./test-fixtures/table/bundle.icl');
         let expectedCfg: any = {
                 "variable": {
                     "content": {"io.netty": "true", "name": "hello-nginx", "port": 80},
                     "list": [{"io.netty": "true", "name": "hello-nginx", "port": 80}]
                 }
             }
         ;
         assert.deepEqual(actualCfg, expectedCfg);
     });*/

    /*it('should generate an flattenAST', function () {
        try {
            let NativeCompiler: NativeCompiler = new NativeCompiler();
            //let actualCfg = NativeCompiler.ast('./test-fixtures/table/bundle.icl');
            let actualCfg = NativeCompiler.parse('./test-fixtures/table/bundle.icl', []);
            fs.writeFileSync('./test-fixtures/table/output.json', JSON.stringify(actualCfg, null, '   '));


        } catch (e) {
            console.log(<ILexYaccError>e);
        }

    });*/

});