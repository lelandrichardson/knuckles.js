Knuckles.container.define({
    name: 'testservice',
    factory:function(){
        return {
            identity: "this is a test service"
        };
    }
});

//var mockLocalStorage = {
//    set: function(){},
//    get: function(){}
//};
//
//
//Knuckles.use({
//    deps: ['todoStorage'],
//    mock: {
//        '$localStorage': mockLocalStorage
//    },
//    callback: function(todoStorage){
//        todoStorage.set(['
//    }
//});
//
//test("todo storage", function(){
//
//
//
//});