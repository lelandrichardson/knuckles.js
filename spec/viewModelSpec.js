describe("ViewModel",function(){

    describe("no dependencies, no extenders",function(){
        it("should allow basic function definition",function(){
            Knuckles.viewModel.define(function NamedViewModel(spec){
                this.specPassedIn = spec;
                this.sayHelloOverride = function(){
                    return "Hello";
                };
            });
        });


    });




});