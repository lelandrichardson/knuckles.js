
var ctorKey = '__ko_typed_array_ctor__',
    toArray = function(args){
        return Array.prototype.slice.call(args, 0).sort();
    },
    cmap = function(array,Ctor){
        var i,
            length = array.length,
            results = [];
        for(i=0;i<length;i++){
            results.push(new Ctor(array[i]));
        }
        return results;
    },
    newMethods = {};

ko.utils.arrayForEach(["push", "unshift"], function (methodName) {
    newMethods[methodName] = function () {
        var needToMap = false,
            mappedArguments;
        if(arguments[0] !== undefined && !(arguments[0] instanceof this[ctorKey])){
            needToMap = true;
            mappedArguments = cmap(toArray(arguments),this[ctorKey]);
        }

        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, needToMap ? mappedArguments : arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

newMethods['splice'] = function () {
    var needToMap = false,
        mappedArguments;
    if(arguments[2] !== undefined && !(arguments[2] instanceof this[ctorKey])){
        needToMap = true;
        mappedArguments = cmap(toArray(arguments).slice(2),this[ctorKey]);
        mappedArguments.unshift(arguments[0],arguments[1]);
    }

    // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
    // (for consistency with mutating regular observables)
    var underlyingArray = this.peek();
    this.valueWillMutate();
    var methodCallResult = underlyingArray['splice'].apply(underlyingArray, needToMap ? mappedArguments : arguments);
    this.valueHasMutated();
    return methodCallResult;
};

ko.observableArray.fn.ofType = function(Ctor){
    var underlying = this,
        interceptor = ko.computed({
            read: underlying,
            write: function(value){
                var needToMap = false,
                    mappedValue;

                if(!!value && value.length > 0 && !(value[0] instanceof underlying[ctorKey])){
                    needToMap = true;
                    mappedValue = cmap(value,underlying[ctorKey]);
                }
                underlying(needToMap ? mappedValue : value);
            }
        });


    underlying[ctorKey] = Ctor;

    ko.utils.extend(interceptor, ko.observableArray['fn']);
    ko.utils.extend(interceptor, newMethods);

    return interceptor;
};
