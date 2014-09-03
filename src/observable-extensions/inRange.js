//extension to replace an observable with a writeable computed that forces write to be numeric
observable.fn.inRange = function(min, max){
    var original = this,
        interceptor = computed({
            read: original,
            write: function(newValue){
                var parsed = parseInt(newValue, 10);
                //if value is bad or negative, then use default
                if(isNaN(parsed) || parsed < 0){
                    parsed = defaultForBadValue;
                }
                original(parsed);
            }
        });
    //process the initial value
    interceptor(original());

    //return this new writeable computed to "stand in front of" our original observable
    return interceptor;
};