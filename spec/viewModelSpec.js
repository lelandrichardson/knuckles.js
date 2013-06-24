describe("ViewModel",function(){

    describe("no dependencies, no extenders",function(){
        it("should allow basic function definition",function(){
            Knuckles.viewModel.define(function NamedViewModel(spec){
                this.specPassedIn = spec;
                this.sayHelloOverride = function(){
                    return "Hello";
                };
            });

            waitsForPromise(Knuckles.use('NamedViewModel'))
                .done(function(NamedViewModel){
                    var person = new NamedViewModel({test: true});
                    expect(person.specPassedIn).toBeDefined();
                    expect(person.specPassedIn.test).toBe(true);
                    expect(person.sayHelloOverride()).toBe("Hello");
                })
        });

        it("should allow basic config definition",function(){
            var name = 'ViewModel1';

            Knuckles.viewModel.define({
                name: name,
                factory: function(spec){
                    this.specPassedIn = spec;
                    this.sayHelloOverride = function(){
                        return "Hello";
                    };
                }
            });

            waitsForPromise(Knuckles.use(name))
                .done(function(NamedViewModel){
                    var person = new NamedViewModel({test: true});
                    expect(person.specPassedIn).toBeDefined();
                    expect(person.specPassedIn.test).toBe(true);
                    expect(person.sayHelloOverride()).toBe("Hello");
                });
        });

        it("should have prototype methods",function(){
            var name = 'ViewModel2';

            Knuckles.viewModel.define({
                name: name,
                factory: function(spec){
                    this.specPassedIn = spec;
                    this.sayHelloOverride = function(){
                        return "Hello";
                    };
                },
                fn: {
                    sayHelloOverride: function(){
                        return "from fn";
                    },
                    sayHello: function(){
                        return "from fn";
                    }
                }
            });

            waitsForPromise(Knuckles.use(name))
                .done(function(NamedViewModel){
                    var person = new NamedViewModel({test: true});
                    expect(person.specPassedIn).toBeDefined();
                    expect(person.specPassedIn.test).toBe(true);
                    expect(person.sayHelloOverride()).toBe("Hello");
                    expect(person.sayHello()).toBe("from fn");
                    expect(NamedViewModel.prototype.sayHello).toBeDefined();
                });
        });

        it("should have dependencies",function(){
            var name = 'ViewModel3';

            Knuckles.viewModel.define({
                name: name,
                deps: ['$http','$async'],
                factory: function(spec,$http,$async){
                    this.specPassedIn = spec;
                    this.$http = $http;
                    this.$async = $async;
                    this.sayHelloOverride = function(){
                        return "Hello";
                    };
                },
                fn: {
                    sayHelloOverride: function(){
                        return "from fn";
                    },
                    sayHello: function(){
                        return "from fn";
                    }
                }
            });

            waitsForPromise(Knuckles.use(name))
                .done(function(nvm){
                    var person = new nvm({test: true});
                    expect(person.$http).toBeDefined();
                    expect(person.$async).toBeDefined();
                });
        });

        it("should have prototype methods with dependencies",function(){
            var name = 'ViewModel4';

            Knuckles.viewModel.define({
                name: name,
                deps: ['$http','$async'],
                factory: function(spec,$http,$async){
                    this.specPassedIn = spec;
                    this.$http = $http;
                    this.$async = $async;
                    this.sayHelloOverride = function(){
                        return "Hello";
                    };
                },
                fn: function($http,$async){
                    return {
                        sayHelloOverride: function(){
                            return "from fn";
                        },
                        sayHello: function(){
                            return "from fn";
                        },
                        getAsync: function(){
                            return $async;
                        },
                        getHttp: function(){
                            return $http;
                        }
                    };
                }
            });

            waitsForPromise(Knuckles.use(name))
                .done(function(NamedViewModel){
                    var person = new NamedViewModel({test: true});
                    expect(person.$http).toBeDefined();
                    expect(person.$async).toBeDefined();

                    expect(NamedViewModel.fn.getHttp).toBeDefined();
                    expect(NamedViewModel.fn.getAsync).toBeDefined();
                    expect(person.getAsync()).toBeDefined();
                    expect(person.getHttp()).toBeDefined();
                });
        });

    });

});