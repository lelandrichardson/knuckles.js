describe("Extenders", function(){

    it("should define a factory that returns an object",function(){
        var extenderName = 'test_extender_123_1';
        Knuckles.extender.define({
            name: extenderName,
            fn: {
                testMethod: function(){
                    return 'test';
                }
            },
            static: {
                testMethod: function(){
                    return 'test static';
                }
            }
        });

        waitsForPromise(Knuckles.use([extenderName]))
            .done(function(extender){
                expect(extender()).toBeDefined();

                expect(extender().fn).toBeDefined();
                expect(extender().fn.testMethod).toBeDefined();
                expect(extender().fn.testMethod()).toEqual('test');

                expect(extender().static).toBeDefined();
                expect(extender().static.testMethod).toBeDefined();
                expect(extender().static.testMethod()).toEqual('test static');
            })
    });

    it("should define a configurable factory method",function(){
        var extenderName = 'test_extender_123_2';
        Knuckles.extender.define({
            name: extenderName,
            defaults: {
                abc: true
            },
            fn: function(config) {
                return  {
                    getAbc: function(){
                        return config.abc;
                    }
                };
            },
            static: function(config) {
                return  {
                    getAbcStatic: function(){
                        return config.abc;
                    }
                };
            }
        });

        waitsForPromise(Knuckles.use([extenderName]))
            .done(function(extender){
                var testConfig = { abc: false};
                expect(extender()).toBeDefined();

                expect(extender().fn).toBeDefined();
                expect(extender().fn.getAbc).toBeDefined();
                expect(extender().fn.getAbc()).toEqual(true);
                expect(extender(testConfig).fn.getAbc()).toEqual(false);

                expect(extender().static).toBeDefined();
                expect(extender().static.getAbcStatic).toBeDefined();
                expect(extender().static.getAbcStatic()).toEqual(true);
                expect(extender(testConfig).static.getAbcStatic()).toEqual(false);
            })
    });

    it("should pass through dependencies",function(){
        var extenderName = 'test_extender_123_3',
            depName = 'test_service_123';

        Knuckles.service.define({
            name: depName,
            factory: function(){
                return {
                    identity: depName
                };
            }
        });


        Knuckles.extender.define({
            name: extenderName,
            deps: [depName],
            defaults: {
                abc: true
            },
            fn: function(config,dep) {
                return  {
                    getDepName: function(){
                        return dep.identity;
                    }
                };
            },
            static: function(config,dep) {
                return  {
                    getDepName: function(){
                        return dep.identity;
                    }
                };
            }
        });

        waitsForPromise(Knuckles.use([extenderName]))
            .done(function(extender){
                expect(extender().fn.getDepName()).toEqual(depName);
                expect(extender().static.getDepName()).toEqual(depName);
            })
    });

    it("should allow pure prototype methods",function(){
        var testNumber = 1,
            extenderName = 'test_extender_' + testNumber,
            modelName = 'test_mdodel_' + testNumber;

        Knuckles.extender.define({
            name: extenderName,
            fn: {
                testMethod: function(){
                    return 'test';
                },
                testThis: function(){
                    return this;
                }
            }
        });

        var extendersObj = {};
        extendersObj[extenderName] = true;

        Knuckles.viewModel.define({
            name: modelName,
            factory: function(){},
            extenders: extendersObj
        });

        waitsForPromise(Knuckles.use(modelName))
            .done(function(Model){
                var model = new Model({});
                expect(model.testMethod).toBeDefined();
                expect(model.testThis).toBeDefined();

                expect(Model.fn.testMethod).toBeDefined();
                expect(Model.fn.testThis).toBeDefined();


                expect(model.testMethod()).toBe('test');
                expect(model.testThis()).toEqual(model);
            });

    });

    it("should allow pure static methods",function(){
        var testNumber = 2,
            extenderName = 'test_extender_' + testNumber,
            modelName = 'test_mdodel_' + testNumber;

        Knuckles.extender.define({
            name: extenderName,
            fn: {
                testMethod: function(){
                    return 'test';
                },
                testThis: function(){
                    return this;
                }
            },
            static: {
                testMethod: function(){
                    return 'test';
                }
            }
        });

        var extendersObj = {};
        extendersObj[extenderName] = true;

        Knuckles.viewModel.define({
            name: modelName,
            factory: function(){},
            extenders: extendersObj
        });

        waitsForPromise(Knuckles.use(modelName))
            .done(function(Model){
                var model = new Model({});
                expect(model.testMethod).toBeDefined();
                expect(model.testThis).toBeDefined();

                expect(Model.fn.testMethod).toBeDefined();
                expect(Model.fn.testThis).toBeDefined();


                expect(model.testMethod()).toBe('test');
                expect(model.testThis()).toEqual(model);

                // actually test static methods
                expect(Model.testMethod).toBeDefined();
                expect(Model.testMethod()).toEqual('test');
            });

    });

    it("should allow defaults to be defined",function(){
        var testNumber = 3,
            extenderName = 'test_extender_' + testNumber,
            modelName = 'test_model_' + testNumber;

        Knuckles.extender.define({
            name: extenderName,
            defaults: {
                a: "a",
                b: "b",
                c: "c"
            },
            fn: function(cfg){
                return {
                    getConfig: function(){
                        return cfg;
                    }
                };
            }
        });

        var extendersObj = {};
        extendersObj[extenderName] = {};

        Knuckles.viewModel.define({
            name: modelName,
            factory: function(){},
            extenders: extendersObj
        });

        waitsForPromise(Knuckles.use(modelName))
            .done(function(Model){

                var model = new Model({});

                var cfg = model.getConfig();

                expect(cfg.a).toEqual("a");
                expect(cfg.b).toEqual("b");
                expect(cfg.c).toEqual("c");

            });
    });

    it("should allow defaults to be overridden",function(){
        var testNumber = 4,
            extenderName = 'test_extender_' + testNumber,
            modelName = 'test_model_' + testNumber;

        Knuckles.extender.define({
            name: extenderName,
            defaults: {
                a: "a",
                b: "b",
                c: "c"
            },
            fn: function(cfg){
                return {
                    getConfig: function(){
                        return cfg;
                    }
                };
            }
        });

        var extendersObj = {};
        extendersObj[extenderName] = {
            a: "!a",
            b: "!b"
        };

        Knuckles.viewModel.define({
            name: modelName,
            factory: function(){},
            extenders: extendersObj
        });

        waitsForPromise(Knuckles.use(modelName))
            .done(function(Model){

                var model = new Model({});

                var cfg = model.getConfig();

                expect(cfg.a).toEqual("!a");
                expect(cfg.b).toEqual("!b");
                expect(cfg.c).toEqual("c");

            });
    });

});
