
var globalRegistry = {};
Knuckles.service = (function(){

    return {
        define: function(config){
            var name = config.name,
                deps = config.deps || [],
                factory = config.factory;


            // factory is required.
            if(!isFunction(factory)){
                $error(1234,"config object must provide factory function");
                return;
            }

            // try to use factory function name if name was not explicitly given.  otherwise error.
            name || (name = factory.name) || $error(1235,"config object must provide a name");


            if(has(globalRegistry,name)){
                // right now, silently fail...  assume user accidentally defined twice.
                $log("module registry for " + name + " called more than once");
                return;
            }

            globalRegistry[name] = {
                name: name,
                deps: deps,
                factory: factory
            };
        },
        remove: function(name){
            var value = globalRegistry[name];
            delete globalRegistry[name];
            return value;
        }
    }
})();




Knuckles.viewModel = {};

Knuckles.viewModel.fn = {
    $populate: function(data){
        return mapping.fromJS(this,data);
    },
    $serialize: mapping.toJS
};

var
    configModule = function(){

    },
    runner = function(){

    };

/**
 * @typedef {Knuckles.Module}
 * @method {function} service - API to create a service
 * @method {function} viewModel - API to create a viewModel
 * @method {function} bindingHandler - API to create a bindingHandler
 */

Knuckles.module = (function(){



    /**
     * Returns a Knuckles module
     * @method module
     * @param {string} name - Module name
     * @param {Array.<string>} [requires] - an array of required resources
     * @returns {Knuckles.Module}
     */
    return function(name, requires){

        /**
         * @typedef {Object} RegistryEntry
         * @property {string} name - Name of the resource to be registered
         * @property {Array.<string>} deps - List of dependencies for the resource
         * @property {Function} factory - a factory function to construct the resource
         */



        var exports = {},

            /**
             * The hashmap of registered resources for this module
             * @type {Object.<string,RegistryEntry>}
             */
            registry = {},

            /**
             * The hashmap of constructed instances of registered resources for this module
             * @type {Object.<string,Knuckles.Service|Knuckles.ViewModel>}}
             */
            cache = {};

        function createResource(config){
            var name = config.name,
                deps = config.deps || [],
                factory = config.factory;


            // factory is required.
            if(!isFunction(factory)){
                $error(1234,"config object must provide factory function");
                return;
            }

            // try to use factory function name if name was not explicitly given.  otherwise error.
            name || (name = factory.name) || $error(1235,"config object must provide a name");


            if(has(registry,name)){
                // right now, silently fail...  assume user accidentally defined twice.
                $log("module registry for " + name + " called more than once");
                return;
            }

            registry[name] = {
                name: name,
                deps: deps,
                factory: factory
            };
        }

        function getResource(name){
            // look for cached version first
            var cached = cache[name];
            if(cached !== undefined){return cached;}

            var entry = registry[name];

            if(entry === undefined){
                entry = globalRegistry[name];
            }
            if(entry === undefined){
                $error(1236,"Factory for " + name + " not registered.");
                return null;
            }


            var constructed = entry.factory.apply(null,map(entry.deps,getResource));

            cache[name] = constructed;

            return constructed;
        }


        //TODO:
//        function createBindingHandler(config){
//
//        }


        function createViewModel(config){
            var name = config.name,
                deps = config.deps || [],
                proto = config.proto || {},
                factory = config.factory,
                extenders = config.extenders || [];

            return createResource({
                name: name,
                deps: deps,
                factory: function(){
                    // not cached, must construct + inject...
                    var args = [undefined], // first entry will be "spec" object
                        extenderArgs = map(extenders,getResource); // set of prototype objects to inherit from
                    //fill in args
                    push.apply(args,map(deps,getResource));


                    var Ctor = function(spec){
                        if(spec !== undefined){
                            args[0] = spec;
                        }
                        return factory.apply(this,args);
                    };

                    // alias 'fn' as prototype
                    Ctor.fn = Ctor.prototype;

                    // add prototype methods
                    extenderArgs.unshift(Ctor.fn,Knuckles.viewModel.fn); // first arg, Knuckles.viewModel.fn
                    extenderArgs.push(proto); // last arg (overrides everything else)
                    extend.apply(null,extenderArgs);



                    return Ctor;
                }
            });
        }



        return extend(exports,{
            // builders
            service: createResource,
            viewModel: createViewModel,

            // methods
            config: configModule,
            getResource: getResource,
            clearCache: function(){
                cache = {};
            },

            run: function(deps,fn){
                fn.apply(null,map(deps,getResource));
            }
        });
    };
})();
