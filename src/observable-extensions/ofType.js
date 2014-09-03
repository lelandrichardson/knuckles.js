observable.fn.ofType = function(Ctor){
    var underlying = this,
        interceptor = computed({
            read: underlying,
            write: function(value){
                underlying((value instanceof underlying[ctorKey]) ? value : new Ctor(value));
            }
        });
    return interceptor;
};