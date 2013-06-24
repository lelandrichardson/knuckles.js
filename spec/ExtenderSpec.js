describe("Extenders", function(){

    it("should define a factory that returns an object",function(){
        var extenderName = 'test_extender_123_1';
        Knuckles.extender.define({
            name: extenderName,
            fn: {
                testMethod: function(){
                    return 'test';
                }
            }
        });

        waitsForPromise(Knuckles.use([extenderName]))
            .done(function(extender){
                expect(extender()).toBeDefined();
                expect(extender().testMethod).toBeDefined();
                expect(extender().testMethod()).toEqual('test');
            })
    });


    it("should define a configurable factory method",function(){
        var extenderName = 'test_extender_123_1';
        Knuckles.extender.define({
            name: extenderName,
            defaults: {

            },
            fn: function(config) {
                return  {
                    returnConfig: function(){
                        return config;
                    }
                };
            }
        });

        waitsForPromise(Knuckles.use([extenderName]))
            .done(function(extender){
                var testDefaults = {};
                expect(extender()).toBeDefined();
                expect(extender().testMethod).toBeDefined();
                expect(extender().testMethod()).toEqual('test');
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

    it("should allow dependencies",function(){

    });

    it("should allow defaults to be defined",function(){

    });

    it("should allow defaults to be overridden",function(){

    });
});
