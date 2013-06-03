Knuckles.service.define({
    name: '$localStorage',
    deps: [],
    factory: function(){
        return localStorage;
    }
});