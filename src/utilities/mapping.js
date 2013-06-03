var mapping = {};

mapping.fromJS = function(model, data){
    var key;
    for(key in data)(function(key, fromServer, onModel){
        if(onModel !== undefined){
            if(isWriteableObservable(onModel)){
                model[key](fromServer);
            } else {
                model[key] = fromServer;
            }
        }
    }(key, data[key], model[key]));
};

mapping.toJS = toJS;
mapping.toJSON = toJSON;

Knuckles.mapping = mapping;