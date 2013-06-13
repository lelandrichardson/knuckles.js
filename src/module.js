Knuckles.service = {
    define: container.define,
    remove: container.remove
};

Knuckles.extender = {

    /**
     *
     * @typedef {Object} ExtenderConfig
     * @property {string} name
     * @property {Array<string>} deps
     *
     *
     *
     */


    /**
     *
     * @param {Object} config
     * @returns {*}
     */
    define: function(config){
        var name = config.name,
            deps = config.deps || [],
            _fn = config.fn || {}, //object or factory function for instance methods
            _static = config.static || {}, //object or factory function for static methods
            fnIsFunction = isFunction(_fn),
            staticIsFunction = isFunction(_static),
            defaults = config.defaults || {}, // default "config" object
            storeInCache = config.cache === true; // default to false


        return container.define({
            name: name,
            deps: deps,
            cache: storeInCache,
            factory: function(/* ... dependencies */){

                var args = slice.call(arguments);
                args.unshift(defaults); // first entry will be "config" object

                var mixin = function(cfg){
                    args[0] = extend({},defaults,cfg);
                    return {
                        fn: fnIsFunction ? _fn.apply(this,args) : _fn,
                        static: staticIsFunction ? _static.apply(this,args) : _static
                    };
                };

                return extend(mixin,{'extenderName':name});
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
            fn = config.fn || {},
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


                extend(Ctor.fn,Knuckles.viewModel.fn);
                each(extenderArgs,function(extender, idx){
                    var cfg = extenders[extender['extenderName']];
                    var toTackOn = extender(cfg);

                    extend(Ctor,toTackOn.static);
                    extend(Ctor.fn,toTackOn.fn);
                });
                extend(Ctor.fn,fn);


                return Ctor;
            }
        });
    },
    remove: container.remove
});
