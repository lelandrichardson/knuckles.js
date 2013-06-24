
/**
 *
 * @typedef {object} Knuckles.ViewModelBase
 */

/*** @namespace */
Knuckles.service = {
    /**
     * Defines a service.  Direct alias for {@link Knuckles.container.define}.
     */
    define: container.define,
    /**
     * Removes a service from the IOC container.  Direct alias for {@link Knuckles.container.remove}.
     */
    remove: container.remove
};


/*** @namespace */
Knuckles.extender = {




    /**
     * Define an extender which can be applied to any viewModel
     *
     * @example
     * Knuckles.extender.define({
     *    name: 'MyExtender',
     *    deps: ['dep1','dep2'],
     *    defaults: {
     *        prop1: 'abc',
     *        prop2: 'def'
     *    }
     *    fn: function(config,dep1,dep2){
     *        // here you have access to the config object passed in, and dependencies
     *        // you are required to return an object hash of methods to "extend" the prototype of
     *        // the viewModel you are wishing to extend
     *        return {
     *            method1: function(){
     *                // here `this` is bound to the corresponding instance of the view model...
     *            }
     *        };
     *    },
     *    static: function(config,dep1,dep2){
     *        // here you have access to the config object passed in, and dependencies
     *        // you are required to return an object hash of methods to directly extend the
     *        // corresponding viewModel Constructor
     *        return {
     *            staticMethod: function(){
     *                // here `this` is bound to the Constructor
     *            }
     *        };
     *    },
     * });
     *
     *
     * @example
     * Knuckles.extender.define({
     *    name: 'MyExtender',
     *    fn: {
     *        method1: function(){
     *            // here `this` is bound to the corresponding instance of the view model...
     *        }
     *    },
     *    static: {
     *        method1: function(){
     *            // here `this` is bound to the corresponding instance of the view model...
     *        }
     *    }
     * });
     *
     *
     *
     *
     * @config {ResourceName} name - The name of the extender.
     * @config {DependencyList} [deps=[]] - Array of dependency names to be passed into factories
     * @config {FactoryMethod|object} [fn] -
     * @config {FactoryMethod|object} [static] - Either a
     * @config {object} [defaults] - An optional object defining the default values of the "config" object to be passed
     *      into the factory functions
     * @config {boolean} [cache=false] - Whether or not a fresh resolved instance should be stored into the
     *      dependency resolver cache or not.  Essentially, if these methods act identically across any viewModel, and
     *      do not require any config objects to be passed in etc, then cache should be true.  It assumes a default
     *      value of false.
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

/*** @namespace */
Knuckles.viewModel = {};


// note: not sure this is needed, but this could serve as the constructor for the
// base "viewModel" class...?
Knuckles.ViewModelBase = function(){};


/**
 * This namespace acts like a prototype for all View Models defined in Knuckles.
 * Users can add methods to it which they would like all view models to automatically inherit.
 *
 * @lends {Knuckles.ViewModelBase}
 * */
Knuckles.viewModel.fn = {
    /**
     * Populates the corresponding ViewModel from a pure JS object passed in.  This is often parsed JSON data
     * coming from the server or some data store.
     *
     * @this {Knuckles.ViewModelBase}
     * @param {object} data - a pure JS object to be mapped to the corresponding ViewModel.
     */
    $populate: function(data){
        return mapping.fromJS(this,data);
    },
    /**
     * "Serializes" the corresponding ViewModel into a pure JS object.
     *
     * @this {Knuckles.ViewModelBase}
     * @returns {object} -
     */
    $serialize: function(){
        return mapping.toJS(this);
    },

    /**
     * Allows one to easily configure which properties of the given {@link ViewModelBase} will be excluded when
     * calling {@link ViewModelBase#$serialize}.
     *
     * @param {Array.<string>|string} names - a property name or array of property names to be ignored
     */
    $jsonIgnore: function(names){
        //TODO:
    }
};



extend(Knuckles.viewModel,
/** @lends Knuckles.viewModel */
{

    /**
     * Defines a View Model.
     *
     * @example
     * // call viewModel.define with only a named function (but no dependencies)
     * Knuckles.viewModel.define(function MyViewModel(spec){
     *      this.id = ko.observable();
     *      this.name = ko.observable();
     *      this.foo = ko.observableArray();
     *
     *      this.$populate(spec);
     * });
     *
     *
     * @example
     * Knuckles.viewModel.define({
     *     name: 'MyViewModel',
     *     deps: ['$http','SubCollection'],
     *     factory: function(spec,$http,SubCollection){
     *         this.id = ko.observable();
     *         this.name = ko.observable();
     *         this.foo = ko.observableArray().ofType(SubCollection);
     *
     *         this.$populate(spec);
     *     },
     *     fn: {
     *          sayHello: function(){
     *              alert("Hello, My Name is " + this.name);
     *          }
     *     },
     *
     *
     *
     * });
     *
     *
     *
     * @param {object|function} config -
     * @config {ResourceName} [name] -
     * @config {DependencyList} [deps=[]] -
     * @config {FactoryMethod|object} [fn] -
     * @config {FactoryMethod} factory
     * @config {object} extenders -
     */
    define: function(config){
        var name = config.name,
            factory = config.factory,
            deps = config.deps || [],
            fn = config.fn || {},
            _static = config.static || {},
            extenders = config.extenders || {},
            extenderKeys = keys(extenders);




        if(factory === undefined && isFunction(config)){
            factory = config;
        }
        if(name === undefined && !isEmptyVal(factory.name)){
            name = factory.name;
        }
        if(!name || !isFunction(factory)){
            $fail("view model must have at least a factory function and name");
        }

        // register the prototype as an "extender"
        // and then add it to the dependency list...
        var protoExtenderName = name + '__fn__' + newGuid();

        // define extender
        Knuckles.extender.define({
            name:protoExtenderName,
            deps: deps,
            fn: fn,
            static: _static
        });

        extenders[protoExtenderName] = null; // null config

        extenderKeys.push(protoExtenderName); // push to make it be applied last

        var combinedDeps = extenderKeys.concat(deps);

        return container.define({
            name: name,
            deps: combinedDeps,
            factory: function(/* ... extenders, ... dependencies */){


                var args = [undefined], // first entry will be "spec" object

                //set of objects to "extend" the viewModel prototype
                extenderArgs = slice.call(arguments,0,arguments.length - deps.length);

                //args to be passed to the constructor function
                push.apply(args,slice.call(arguments,arguments.length - deps.length));

                // note: consider doing something like this:
                // http://stackoverflow.com/questions/14866014/debugging-javascript-backbone-and-marionette
                // this would allow for nicer function names while debugging
                var Ctor = function(spec){
                    args[0] = spec;
                    return factory.apply(this,args);
                };

                // alias 'fn' as prototype
                Ctor.fn = Ctor.prototype;

                // add mixins
                extend(Ctor.fn, Knuckles.viewModel.fn);
                each(extenderArgs,function(extender, idx){
                    var cfg = extenders[extender['extenderName']];
                    var toTackOn = extender(cfg);

                    // static methods
                    extend(Ctor, toTackOn.static);

                    //instance methods
                    extend(Ctor.fn, toTackOn.fn);
                });


                return Ctor;
            }
        });
    },

    /** Alias for {@link Knuckles.container.remove} */
    remove: container.remove
});
