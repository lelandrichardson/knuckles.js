/**
 * @name ExtenderConfig
 * @typedef {Object} ExtenderConfig
 * @property {ResourceName} [name]
 * @property {DependencyList} [deps=[]]
 * @property {object|FactoryMethod} [fn]
 * @property {object|FactoryMethod} [static]
 */

/**
 * A string representing the name of a resource registered in the IOC container
 *
 * @name ResourceName
 * @typedef {string} ResourceName
 */

/**
 * A list of named dependencies
 * @name DependencyList
 * @typedef {Array.<ResourceName>} DependencyList
 */




/**
 * A FactoryMethod is a function which is defined expecting a set of arguments to be bound by the Knuckles IOC
 * container.  These dependencies are usually defined manually by the end user as an array of strings corresponding to
 * the names of the dependencies wanting to be passed in.  The order of the arguments passed in will be the same order
 * that the dependency array had (see {@link DependencyList}).
 *
 * @name FactoryMethod
 * @typedef {function(...object)} FactoryMethod
 */



/**
 * The Global IOC Container used in Knuckles.js
 *
 * This container is ultimately used to define all resources including Extenders, Services, ViewModels, etc.
 * @namespace
 * @type {
 *     {
 *          define: function,
 *          use: function(DependencyList) : Promise,
 *          clearCache: function,
 *          clearRegistry: function
 *     }
 * }
 */
var container = Knuckles.container = (function(){
    var registry = {},
        cache = {};

    function createResource(config){
        var name = config.name,
            deps = config.deps || [],
            factory = config.factory,
            storeInCache = (config.cache !== false);

        // factory is required.
        if(!isFunction(factory)){
            $fail("config object must provide factory function",1234);
            return;
        }

        // try to use factory function name if name was not explicitly given.  otherwise error.
        name || (name = factory.name) || $fail("config object must provide a resource name",12345);


        if(has(registry,name)){
            // right now, silently fail...  assume user accidentally defined twice.
            $log("module registry for " + name + " called more than once");
            return;
        }

        registry[name] = {
            name: name,
            deps: deps,
            factory: factory,
            storeInCache: storeInCache
        };
    }

    function getResourcePromise(name,requireWasUsed){
        var promise = $deferred();

        var cached = cache[name];
        if(cached !== undefined){
            promise.resolve(cached);
            return promise;
        }

        var entry = registry[name];


        // important to do === true since second param could be an index being called from map();
        if(entry === undefined){
            if(requireWasUsed !== true){
                require([name],function(/* not sure if we need arguments here??? */){

                    var newPromise = getResourcePromise(name,false);
                    newPromise.done(function(resource){
                        promise.resolve(resource);
                    });
                });
            } else {
                promise.fail("Resource '" + name + 'was not found');
                $fail("Resource '" + name + 'was not found',1234);
            }
        } else {

            var newPromise = $when.apply(null,map(entry.deps,getResourcePromise));
            newPromise.done(function(/* resolved dependencies of entry */){
                var constructed = entry.factory.apply(null,arguments);

                // some resources should not be cached
                entry.storeInCache && (cache[name] = constructed);
                promise.resolve(constructed);
            }).fail(function(reason){
                $fail(reason);
            });
        }

        return promise;
    }

    function useResources(a,b){
        var mock = {},
            proxies = {},
            deps,
            name,
            callback,
            always = noop;

        if(isArray(a) && (isFunction(b) || b === undefined)){
            // in this case, no mocks were passed in. this is "typical case"
            deps = a;
            callback = b;
        } else if(isString(a) && (isFunction(b) || b === undefined)) {
            // using a single resource (string is allowed as first param)
            deps = [a];
            callback = b;
        } else {
            mock = a.mock || {};
            deps = a.deps || [];
            callback = a.callback || b || noop;
            always = function(){
                var name;
                for (name in mock){

                    // remove mock object
                    delete cache[name];

                    // reset cache with proxied object, if existed
                    if(proxies[name] !== undefined){
                        cache[name] = proxies[name];
                    }
                }
            };

            for (name in mock){
                // if object exists in cache, proxy it
                if(cache[name] !== undefined){
                    proxies[name] = cache[name]
                }
                // set cache object with mock object
                cache[name] = mock[name];
            }
        }
        // retrieve collection of promises resolving dependencies...
        return $when.apply(null,map(deps,getResourcePromise))
            .done(callback || noop)
            .fail(function(reason){$fail(reason);})
            .always(always);
    }

    return {
        /**
         * @config {string} [name] - The name of the resource to be registered.  A name must be passed in or
         * @config {DependencyList} [deps=[]] - The list of resources this resource is dependent upon.
         * @config {FactoryMethod} factory - The Factory method to be invoked when the resource needs to be resolved.
         * @config {boolean} [cache=false] -
         */
        define: createResource,

        /**
         * Used to collect run scripts against resolved resources.  This would be the most common way of actually
         * running the intialization stage of your application.
         *
         * @config {DependencyList|ResourceName|object} a -
         * @config {FactoryMethod} [callback] - If supplied, this method will bet invoked with the requested dependent
         *      resources bound to the arguments.
         * @config {Promise} - A promise which will resolve once all dependencies are resolved, and pass them through
         *      the pipeline.
         * @config {object} [mock] - An object hash of mock resources. The keys corresponding to the {@link ResourceName}s
         *      of the resources, and the values corresponding to the mock instance you would like to use.  This is
         *      going to most commonly be used for testing.
         */
        use: useResources,

        /**
         * If called with a name parameter, removes the corresponding resource from the Dependency Resolver Cache,
         * resulting in a new instance of the resource being created the next time it is used.
         * If name is excluded, all resources will be removed from the cache.
         *
         * @param name
         */
        clearCache: function(name){
            if(name === undefined){
                cache = {};
            } else {
                delete cache[name];
            }

        },

        /**
         * If called with a name parameter, removes the corresponding registry from the {Knuckles.container} IOC Container.
         * If name is excluded, this will remove all resources from the IOC container.
         *
         * @param [name] - name of resource
         */
        clearRegistry: function(name){
            if(name === undefined){
                registry = {};
            } else {
                delete registry[name];
            }
        }
    };

})();

extend(Knuckles,
/** @lends Knuckles */
{
    //shortcuts
    /** Alias for {@link Knuckles.container.use} */
    use: container.use,
    /** Alias for {@link Knuckles.container.use} */
    run: container.use,
    /** Alias for {@link Knuckles.container.define} */
    define: container.define
});
