Knuckles.service.define({
    name: '$bind',
    deps: [],
    factory: function(){
        return applyBindings;
    }
});