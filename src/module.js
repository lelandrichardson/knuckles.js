Knuckles.service = {
    define: container.define,
    remove: container.remove
};

Knuckles.extender = {
    define: function(config){
        var name = config.name,
            deps = config.deps || [],
            factory = config.factory,
            defaults = config.defaults,
            storeInCache = config.cache === true; // default to false


        return container.define({
            name: name,
            deps: deps,
            cache: storeInCache,
            factory: function(/* ... dependencies */){

                var args = slice.call(arguments);
                args.unshift(defaults); // first entry will be "config" object

                var mixin = function(config){
                    args[0] = extend({},defaults,config);
                    return factory.apply(this,args);
                };

                return mixin;
            }
        });


    },
    remove: container.remove
};

Knuckles.viewModel = {};

Knuckles.viewModel.fn = {
    $populate: function(data){
        return mapping.fromJS(this,data);
    },
    $serialize: mapping.toJS
};

var keys = function(obj){
    var result = [], name;
    for(name in obj){
        if(has(obj,name)) result.push(name);
    }
    return result;
};

extend(Knuckles.viewModel,{
    define: function(config){
        var name = config.name,
            deps = config.deps || [],
            proto = config.proto || {},
            factory = config.factory,
            extenders = config.extenders || {},
            combinedDeps = [].concat(keys(extenders)).concat(deps);

        return container.define({
            name: name,
            deps: combinedDeps,
            factory: function(/* ... extenders, ... dependencies */){


                var args = [undefined], // first entry will be "spec" object

                    //set of objects to "extend" the viewModel prototype
                    extenderArgs = slice.call(arguments,0,deps.length);

                //args to be passed to the constructor function
                push.apply(args,slice.call(arguments,deps.length));


                var Ctor = function(spec){
                    args[0] = spec;
                    return factory.apply(this,args);
                };

                // alias 'fn' as prototypew
                Ctor.fn = Ctor.prototype;

                //TODO: get this set up...
                // where is i?
                var instExtenders = map(extenders,function(el,name){
                    return extenderArgs[i](el);
                });


                // add prototype methods
                extenderArgs.unshift(Ctor.fn, Knuckles.viewModel.fn); // first arg, Knuckles.viewModel.fn
                extenderArgs.push(proto); // last arg (overrides everything else)
                extend.apply(null,extenderArgs);

                return Ctor;
            }
        });
    },
    remove: container.remove
});
