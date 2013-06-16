describe("Container",function(){
    var resource1 = 'name1',
        resource2 = 'name2',
        resource3 = 'name3';
    describe("defining resources",function(){
        it("should allow a dependency-less resource",function(){
            Knuckles.container.define({
                name: resource1,
                factory: function(){
                    return {
                        name: resource1
                    };
                }
            });

            expect(Knuckles.container.isRegistered(resource1)).toBe(true);
        });

        it("should allow a single dependency resource",function(){
            Knuckles.container.define({
                name: resource2,
                deps: [resource1],
                factory: function(resolved){
                    return {
                        name: resource2,
                        dependsOn: resolved.name
                    };
                }
            });

            expect(Knuckles.container.isRegistered(resource1)).toBe(true);
        });

        it("should allow a multi-dependency resource",function(){
            Knuckles.container.define({
                name: resource3,
                deps: [resource1,resource2],
                factory: function(resolved1,resolved2){
                    return {
                        name: resource3,
                        dependsOn: [resolved1.name,resolved2.name].join(',')
                    };
                }
            });

            expect(Knuckles.container.isRegistered(resource1)).toBe(true);
        });
    });

    describe("using resources",function(){
        it("should allow me to use a dependency-less resource",function(){
            waitsForPromise(Knuckles.container.use([resource1],function(resolved){
                expect(resolved.name).toEqual(resource1);
                expect(arguments.length).toEqual(1);
            }));
        });

        it("should allow me to use a single-dependency resource",function(){
            waitsForPromise(Knuckles.container.use([resource2]))
            .done(function(resolved){
                expect(arguments.length).toEqual(1);
                expect(resolved.name).toEqual(resource2);
                expect(resolved.dependsOn).toEqual(resource1);
            });
        });

        it("should allow me to use a multi-dependency resource",function(){
            waitsForPromise(Knuckles.container.use([resource3]))
            .done(function(resolved){
                expect(arguments.length).toEqual(1);
                expect(resolved.name).toEqual(resource3);
                expect(resolved.dependsOn).toEqual([resource1,resource2].join(','));
            });
        });

        it("should allow me to use multiple resources",function(){
            waitsForPromise(Knuckles.container.use([resource1,resource2]))
            .done(function(resolved1,resolved2){
                expect(arguments.length).toEqual(2);
                expect(resolved1.name).toEqual(resource1);
                expect(resolved2.name).toEqual(resource2);
            });
        });

        it("should allow me to mock a resource",function(){
            waitsForPromise(Knuckles.container.use([resource1,resource2]))
            .done(function(resolved1,resolved2){
                expect(arguments.length).toEqual(2);
                expect(resolved1.name).toEqual(resource1);
                expect(resolved2.name).toEqual(resource2);
            });
        });
    });
});