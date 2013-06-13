var container = (function(){
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
        define: createResource,
        use: useResources,
        clearCache: function(name){
            if(name === undefined){
                cache = {};
            } else {
                delete cache[name];
            }

        },
        clearRegistry: function(name){
            if(name === undefined){
                registry = {};
            } else {
                delete registry[name];
            }
        }
    };

})();

extend(Knuckles,{
    container: container,

    //shortcuts
    use: container.use,
    run: container.use,
    define: container.define
});
