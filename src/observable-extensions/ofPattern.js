observable.fn.ofPattern = function(pattern){
    var original = this,
        interceptor = computed({
            read: original,
            write: function(newValue){
                if(pattern.test(newValue)) {
                    original(newValue);
                } else {
                    original.notifySubscribers();
                }
            }
        });

    interceptor(original());

    return interceptor;
};