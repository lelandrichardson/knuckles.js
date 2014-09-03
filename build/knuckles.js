// knuckles 0.0.1 | (c) 2013 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        //jQuery = window["jQuery"],
        JSON = window["JSON"],
        ko = window["ko"],
        require = window["require"],
        define = window["define"];


!function(factory) {
    if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports','knockout','jquery'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['Knuckles'] = {},window['ko'],window['jQuery']);
    }
}(function(Knuckles,ko,$){



// initialize if empty
/** @namespace */
var Knuckles = window['Knuckles'] = Knuckles || {};

Knuckles.version = "##VERSION##";

if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function() {
        function pad(n) { return n < 10 ? '0' + n : n }
        return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
    };
}


// useful prototypes
var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;


// Establish the object that gets returned to break out of a loop iteration.
var breaker = {},
    noop = function(){};


// Create quick reference variables for speed access to core prototypes.
var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;


//convenience function for hasOwnProperty call.
var has = function(obj,key){
    return hasOwnProperty.call(obj,key);
};

// global each function
var each = Knuckles.each = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        for (var key in obj) {
            if (has(obj, key)) {
                if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
        }
    }
};

var map = Knuckles.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
};

// global extend function
var extend = Knuckles.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};



//shortcut to parse int (base 10)
function int(str){
   return parseInt(str,10);
}

function valueFn(value){
    return function(){
        return value;
    };
}

var keys = function(obj){
    var result = [], name;
    for(name in obj){
        if(has(obj,name)) result.push(name);
    }
    return result;
};

/**
 * Generates random strings for use as UUIDs
 */
var newGuid = (function(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function(){
        return s4() + s4();
    }
})();


// Knockout Shortcut Methods
// ---------------------------------------------
var

    observable = ko.observable,
    observableArray = ko.observableArray,
    computed = ko.computed,

    unwrap = ko.utils.unwrapObservable,

    isObservable = ko.isObservable,
    isWriteableObservable = ko.isWriteableObservable,
    isComputed = ko.isComputed,

    registerEventHandler = ko.utils.registerEventHandler,
    bindingHandlers = ko.bindingHandlers,

    applyBindings = ko.applyBindings,
    applyBindingsToNode = ko.applyBindingsToNode,
    toJS = ko.toJS,
    toJSON = ko.toJSON;



// Existential Functions
// ---------------------------------------------
var
    isEmptyVal = function (val) {
        return val === undefined ||
               val === null ||
               val === "";
    },
    isArray = function (o) {
        return toString.call(o) === '[object Array]';
    },
    isObject = function (o) {
        return o !== null && typeof o === 'object';
    },
    isString = function(o){
        return typeof o == 'string';
    },
    isNumber = function(o){
        return typeof o == 'number';
    },
    isFunction = function(o){
        return typeof o == 'function';
    },
    isBoolean = function(o){
        return typeof o == 'boolean';
    },
    isDate = function(o){
        return toString.call(o) == '[object Date]';
    },
    isDefined = function(o){
        return o !== undefined;
    };

// string functions
// --------------------------------------------
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;},
    uppercase = function(string){return isString(string) ? string.toUpperCase() : string;},
    trim = function(value) {
        return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
    };



// Global Utility Functions
// --------------------------------------------
var $fail = function(message, code){
    throw new Error('' + (!!code ? code + ': ' : '') + message);
};

//todo: use debug somehow?
var $log = function(msg){
    switch(arguments.length){
        case 1:
            console.log(msg);
            break;
        case 0:
            return;
        default:
            console.log(slice.apply(arguments).split(' '));
    }
};

//alias for $.Deferred... this could change to another deferred provider later.  perhaps our own?
var $deferred = $.Deferred,
    $when = $.when;

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
            if(requireWasUsed !== true && isFunction(require)){
                require([name],function(/* not sure if we need arguments here??? */){

                    var newPromise = getResourcePromise(name,false);
                    newPromise.done(function(resource){
                        promise.resolve(resource);
                    });
                });
            } else {
                promise.fail("Resource '" + name + "' was not found");
                $fail("Resource '" + name + "' was not found",1234);
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
            .always(always)
            .done(callback || noop)
            .fail(function(reason){$fail(reason);})
            .promise();
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
        },
        isRegistered: function(name){
            if(!isString(name)){
                $fail("expecting parameter 'name' to be a string");
                return false;
            }
            return has(registry,name);
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


var formatting = Knuckles.formatting = (function () {

    // currency formatting
    // -----------------------------------------------------
    var currency = function(amount, symbol){
        if(symbol === undefined){
            symbol = Knuckles.formatting.currency.defaultSymbol;
        }
        return symbol + (+amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };
    currency.defaultSymbol = '$';


    // date formatting "timeAgo"
    // ----------------------------------------------------
    var timeAgo = function (date) {
        var secs = (((new Date()).getTime() - date.getTime()) / 1000),
            days = Math.floor(secs / 86400);

        return days === 0 && (
            secs < 60 && "just now" ||
                secs < 120 && "a minute ago" ||
                secs < 3600 && Math.floor(secs / 60) + " minutes ago" ||
                secs < 7200 && "an hour ago" ||
                secs < 86400 && Math.floor(secs / 3600) + " hours ago") ||
            days === 1 && "yesterday" ||
            days < 31 && days + " days ago" ||
            days < 60 && "one month ago" ||
            days < 365 && Math.ceil(days / 30) + " months ago" ||
            days < 730 && "one year ago" ||
            Math.ceil(days / 365) + " years ago";
    };

    return {
        currency: currency,
        timeAgo: timeAgo
    }
}());

// This file was taken and modified from the source below.
// all modification was simply to pull date format into the Knuckles standard.

/*
 * ----------------------------------------------------------------------------
 * Package:     JS Date Format Patch
 * Version:     0.9.12
 * Date:        2012-07-06
 * Description: In lack of decent formatting ability of Javascript Date object,
 *              I have created this "patch" for the Date object which will add
 *              "Date.format(dateObject, format)" static function, and the
 *              "dateObject.toFormattedString(format)" member function.
 *              Along with the formatting abilities, I have also added the
 *              following functions for parsing dates:
 *              "Date.parseFormatted(value, format)" - static function
 *              "dateObject.fromFormattedString(value, format)" - member
 *              function
 * Author:      Miljenko Barbir
 * Author URL:  http://miljenkobarbir.com/
 * Repository:  http://github.com/barbir/js-date-format
 * ----------------------------------------------------------------------------
 * Copyright (c) 2010 Miljenko Barbir
 * Dual licensed under the MIT and GPL licenses.
 * ----------------------------------------------------------------------------
 */

(function(formatting){
    // this is the format logic helper object that contains the helper functions
    // and the internationalization settings that can be overridden
    var formatLogic = {
        // left-pad the provided number with zeros
        pad: function (value, digits)
        {
            var max = 1;
            var zeros = "";

            if(digits < 1)
            {
                return "";
            }

            for(var i = 0; i < digits; i++)
            {
                max *= 10;
                zeros += "0";
            }

            var output = zeros + value;
            output = output.substring(output.length - digits);

            return output;
        },

        // convert the 24 hour style value to a 12 hour style value
        convertTo12Hour: function (value)
        {
            return value % 12 === 0 ? 12 : value % 12;
        },

        // internationalization settings
        i18n:
        {
            dayNames:			['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            shortDayNames:		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames:			['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            shortMonthNames:	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    };

    // extend the Javascript Date class with the "format" static function which will format
    // the provided date object using the provided format string
    var format = function (date, format){
        //if formatting isn't present, use default
        format || (format = formatting.date.default);

        // check if the AM/PM option is used
        var isAmPm		= (format.indexOf("a") !== -1) || (format.indexOf("A") !== -1);

        // prepare all the parts of the date that can be used in the format
        var parts		= [];
        parts['d']		= date.getDate();
        parts['dd']		= formatLogic.pad(parts['d'], 2);
        parts['ddd']	= formatLogic.i18n.shortDayNames[date.getDay()];
        parts['dddd']	= formatLogic.i18n.dayNames[date.getDay()];
        parts['M']		= date.getMonth() + 1;
        parts['MM']		= formatLogic.pad(parts['M'], 2);
        parts['MMM']	= formatLogic.i18n.shortMonthNames[parts['M'] - 1];
        parts['MMMM']	= formatLogic.i18n.monthNames[parts['M'] - 1];
        parts['yyyy']	= date.getFullYear();
        parts['yyy']	= formatLogic.pad(parts['yyyy'], 2) + 'y';
        parts['yy']		= formatLogic.pad(parts['yyyy'], 2);
        parts['y']		= 'y';
        parts['H']		= date.getHours();
        parts['hh']		= formatLogic.pad(isAmPm ? formatLogic.convertTo12Hour(parts['H']) : parts['H'], 2);
        parts['h']		= isAmPm ? formatLogic.convertTo12Hour(parts['H']) : parts['H'];
        parts['HH']		= formatLogic.pad(parts['H'], 2);
        parts['m']		= date.getMinutes();
        parts['mm']		= formatLogic.pad(parts['m'], 2);
        parts['s']		= date.getSeconds();
        parts['ss']		= formatLogic.pad(parts['s'], 2);
        parts['z']		= date.getMilliseconds();
        parts['zz']		= parts['z'] + 'z';
        parts['zzz']	= formatLogic.pad(parts['z'], 3);
        parts['ap']		= parts['H'] < 12 ? 'am' : 'pm';
        parts['a']		= parts['H'] < 12 ? 'am' : 'pm';
        parts['AP']		= parts['H'] < 12 ? 'AM' : 'PM';
        parts['A']		= parts['H'] < 12 ? 'AM' : 'PM';

        // parse the input format, char by char
        var i = 0;
        var output = "";
        var token = "";
        while (i < format.length)
        {
            token = format.charAt(i);

            while((i + 1 < format.length) && parts[token + format.charAt(i + 1)] !== undefined)
            {
                token += format.charAt(++i);
            }

            if (parts[token] !== undefined)
            {
                output += parts[token];
            }
            else
            {
                output += token;
            }

            i++;
        }

        // return the parsed result
        return output;
    };


    // this is the parse logic helper object that contains the helper functions
    var parseLogic = {
        unpad: function (value)
        {
            var output = value;

            while(output.length > 1)
            {
                if(output[0] === '0')
                {
                    output = output.substring(1, output.length);
                }
                else
                {
                    break;
                }
            }

            return output;
        },
        parseInt: function (value)
        {
            return parseInt(this.unpad(value), 10);
        }
    };

    // extend the Javascript Date class with the "parseFormatted" static function which
    // will parse the provided string, using the provided format into a valid date object
    var parse = function (value, format){
        var output		= new Date(2000, 0, 1);
        var parts		= [];
        parts['d']		= '([0-9][0-9]?)';
        parts['dd']		= '([0-9][0-9])';
//	parts['ddd']	= NOT SUPPORTED;
//	parts['dddd']	= NOT SUPPORTED;
        parts['M']		= '([0-9][0-9]?)';
        parts['MM']		= '([0-9][0-9])';
//	parts['MMM']	= NOT SUPPORTED;
//	parts['MMMM']	= NOT SUPPORTED;
        parts['yyyy']	= '([0-9][0-9][0-9][0-9])';
        parts['yyy']	= '([0-9][0-9])[y]';
        parts['yy']		= '([0-9][0-9])';
        parts['H']		= '([0-9][0-9]?)';
        parts['hh']		= '([0-9][0-9])';
        parts['h']		= '([0-9][0-9]?)';
        parts['HH']		= '([0-9][0-9])';
        parts['m']		= '([0-9][0-9]?)';
        parts['mm']		= '([0-9][0-9])';
        parts['s']		= '([0-9][0-9]?)';
        parts['ss']		= '([0-9][0-9])';
        parts['z']		= '([0-9][0-9]?[0-9]?)';
        parts['zz']		= '([0-9][0-9]?[0-9]?)[z]';
        parts['zzz']	= '([0-9][0-9][0-9])';
        parts['ap']		= '([ap][m])';
        parts['a']		= '([ap][m])';
        parts['AP']		= '([AP][M])';
        parts['A']		= '([AP][M])';

        // parse the input format, char by char
        var i = 0;
        var regex = "";
        var outputs = new Array("");
        var token = "";

        // parse the format to get the extraction regex
        while (i < format.length)
        {
            token = format.charAt(i);
            while((i + 1 < format.length) && parts[token + format.charAt(i + 1)] !== undefined)
            {
                token += format.charAt(++i);
            }

            if (parts[token] !== undefined)
            {
                regex += parts[token];
                outputs[outputs.length] = token;
            }
            else
            {
                regex += token;
            }

            i++;
        }

        // extract matches
        var r = new RegExp(regex);
        var matches = value.match(r);

        if(matches === undefined || matches.length !== outputs.length)
        {
            return undefined;
        }

        // parse each match and update the output date object
        for(i = 0; i < outputs.length; i++)
        {
            if(outputs[i] !== '')
            {
                switch(outputs[i])
                {
                    case 'yyyy':
                    case 'yyy':
                        output.setYear(parseLogic.parseInt(matches[i]));
                        break;

                    case 'yy':
                        output.setYear(2000 + parseLogic.parseInt(matches[i]));
                        break;

                    case 'MM':
                    case 'M':
                        output.setMonth(parseLogic.parseInt(matches[i]) - 1);
                        break;

                    case 'dd':
                    case 'd':
                        output.setDate(parseLogic.parseInt(matches[i]));
                        break;

                    case 'hh':
                    case 'h':
                    case 'HH':
                    case 'H':
                        output.setHours(parseLogic.parseInt(matches[i]));
                        break;

                    case 'mm':
                    case 'm':
                        output.setMinutes(parseLogic.parseInt(matches[i]));
                        break;

                    case 'ss':
                    case 's':
                        output.setSeconds(parseLogic.parseInt(matches[i]));
                        break;

                    case 'zzz':
                    case 'zz':
                    case 'z':
                        output.setMilliseconds(parseLogic.parseInt(matches[i]));
                        break;

                    case 'AP':
                    case 'A':
                    case 'ap':
                    case 'a':
                        if((matches[i] === 'PM' || matches[i] === 'pm') && (output.getHours() < 12))
                        {
                            output.setHours(output.getHours() + 12);
                        }

                        if((matches[i] === 'AM' || matches[i] === 'am') && (output.getHours() === 12))
                        {
                            output.setHours(0);
                        }
                        break;
                }
            }
        }

        return output;
    };

    extend(formatting,{
        date: extend(format,{
            names: formatLogic.i18n,
            parse: parse,
            default: 'yyyy-MM-dd'
        }),

        // the datetime formatter is essentially an alias of the `date` formatter,
        // but also exposes an additional default to override for convenience
        datetime: extend(function(dt,format){
            return formatting.date(dt,format || formatting.datetime.default);
        },{ default: 'yyyy-MM-dd HH:mm:ss' })
    }) ;

})(formatting);

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

(function(validation){
    var getValue = function(o){
        return (typeof o === 'function' ? o() : o);
    };

    validation.rules = {};
    validation.rules['required'] = {
        validator: function (val, required) {
            var stringTrimRegEx = /^\s+|\s+$/g,
                testVal;

            if (val === undefined || val === null) {
                return !required;
            }

            testVal = val;
            if (typeof (val) === "string") {
                testVal = val.replace(stringTrimRegEx, '');
            }

            if (!required) {// if they passed: { required: false }, then don't require this
                return true;
            }

            return ((testVal + '').length > 0);
        },
        message: 'This field is required.'
    };

    validation.rules['min'] = {
        validator: function (val, min) {
            return isEmptyVal(val) || val >= min;
        },
        message: 'Please enter a value greater than or equal to {0}.'
    };

    validation.rules['max'] = {
        validator: function (val, max) {
            return isEmptyVal(val) || val <= max;
        },
        message: 'Please enter a value less than or equal to {0}.'
    };

    validation.rules['minLength'] = {
        validator: function (val, minLength) {
            return isEmptyVal(val) || val.length >= minLength;
        },
        message: 'Please enter at least {0} characters.'
    };

    validation.rules['maxLength'] = {
        validator: function (val, maxLength) {
            return isEmptyVal(val) || val.length <= maxLength;
        },
        message: 'Please enter no more than {0} characters.'
    };

    validation.rules['pattern'] = {
        validator: function (val, regex) {
            return isEmptyVal(val) || val.toString().match(regex) !== null;
        },
        message: 'Please check this value.'
    };

    validation.rules['step'] = {
        validator: function (val, step) {

            // in order to handle steps of .1 & .01 etc.. Modulus won't work
            // if the value is a decimal, so we have to correct for that
            return isEmptyVal(val) || (val * 100) % (step * 100) === 0;
        },
        message: 'The value must increment by {0}'
    };

    validation.rules['email'] = {
        validator: function (val, validate) {
            if (!validate) { return true; }

            //I think an empty email address is also a valid entry
            //if one want's to enforce entry it should be done with 'required: true'
            return isEmptyVal(val) || (
                // jquery validate regex - thanks Scott Gonzalez
                validate && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(val)
                );
        },
        message: 'Please enter a proper email address'
    };

    validation.rules['date'] = {
        validator: function (value, validate) {
            if (!validate) { return true; }
            return isEmptyVal(value) || (validate && !/Invalid|NaN/.test(new Date(value)));
        },
        message: 'Please enter a proper date'
    };

    validation.rules['dateISO'] = {
        validator: function (value, validate) {
            if (!validate) { return true; }
            return isEmptyVal(value) || (validate && /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value));
        },
        message: 'Please enter a proper date'
    };

    validation.rules['number'] = {
        validator: function (value, validate) {
            if (!validate) { return true; }
            return isEmptyVal(value) || (validate && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value));
        },
        message: 'Please enter a number'
    };

    validation.rules['digit'] = {
        validator: function (value, validate) {
            if (!validate) { return true; }
            return isEmptyVal(value) || (validate && /^\d+$/.test(value));
        },
        message: 'Please enter a digit'
    };

    validation.rules['phoneUS'] = {
        validator: function (phoneNumber, validate) {
            if (!validate) { return true; }
            if (typeof (phoneNumber) !== 'string') { return false; }
            if (isEmptyVal(phoneNumber)) { return true; } // makes it optional, use 'required' rule if it should be required
            phoneNumber = phoneNumber.replace(/\s+/g, "");
            return validate && phoneNumber.length > 9 && phoneNumber.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        },
        message: 'Please specify a valid phone number'
    };

    validation.rules['equal'] = {
        validator: function (val, params) {
            var otherValue = params;
            return val === getValue(otherValue);
        },
        message: 'Values must equal'
    };

    validation.rules['notEqual'] = {
        validator: function (val, params) {
            var otherValue = params;
            return val !== getValue(otherValue);
        },
        message: 'Please choose another value.'
    };

    //unique in collection
    // options are:
    //    collection: array or function returning (observable) array
    //              in which the value has to be unique
    //    valueAccessor: function that returns value from an object stored in collection
    //              if it is null the value is compared directly
    //    external: set to true when object you are validating is automatically updating collection
    validation.rules['unique'] = {
        validator: function (val, options) {
            var c = getValue(options.collection),
                external = getValue(options.externalValue),
                counter = 0;

            if (!val || !c) { return true; }

            ko.utils.arrayFilter(ko.utils.unwrapObservable(c), function (item) {
                if (val === (options.valueAccessor ? options.valueAccessor(item) : item)) { counter++; }
            });
            // if value is external even 1 same value in collection means the value is not unique
            return counter < (external !== undefined && val !== external ? 1 : 2);
        },
        message: 'Please make sure the value is unique.'
    };







    var fluent = function(func){
        return function(){
            func.apply(this,arguments);
            return this;
        };
    };

    var validateFn = extend({},{

    });

    observable.fn.validatable = function(){
        extend(
            this,
            // expose the validation extensions
            validateFn,
            {
                // the array of validation functions to check when validating
                rules: []
            }
        );
        // right now this is a function... not sure if we should make it a computed or not?
        this.isValid = function(){

        }.bind(this);
    };



})(Knuckles.validation || (Knuckles.validation = {}));

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


Knuckles.service.define({
    name: '$http',
    deps: [],
    factory: function(){
            //TODO: define additional APIs for these functions (ie, .post(url,data) )
            var $http = function(cfg) {
                return $.ajax(extend(cfg, {
                    data: (cfg.dataType === 'json' && !cfg.processData) ? JSON.stringify(cfg.data) : cfg.data
                }));
            };
            return extend($http,{
                POST_OPTIONS: {
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    processData: false,
                    type: 'POST'
                },
                GET_OPTIONS: extend({},$http.POST_OPTIONS, { type: 'GET' }),
                PUT_OPTIONS:  extend({}, $http.POST_OPTIONS, { type: 'PUT' }),
                DELETE_OPTIONS: extend({}, $http.POST_OPTIONS, { type: 'DELETE' }),



                post: function (cfg) {
                    return $http(extend({}, $http.POST_OPTIONS, cfg));
                },
                get: function (cfg) {
                    return $http(extend({}, $http.GET_OPTIONS, cfg));
                },
                put: function (cfg) {
                    return $http(extend({}, $http.PUT_OPTIONS, cfg));
                },
                delete: function (cfg) {
                    return $http(extend({}, $http.DELETE_OPTIONS, cfg));
                }
            });
    }
});

/**
 * A version of the Promise Monad used by Knuckles.  As of now this is essentially a wrapper around the jQuery
 * implementation.
 *
 * @name Promise
 * @typedef {Object} Promise
 * @property {function(function)} always - Add handlers to be called when the Deferred object is either resolved or
 *      rejected.
 * @property {function(function)} done - Add handlers to be called when the Deferred object is resolved.
 * @property {function(function)} fail - Add handlers to be called when the Deferred object is rejected.
 * @property {function(function,function)} then - Add handlers to be called when the Deferred object is resolved,
 *      rejected, or still in progress.
 * @property {function} isResolved - Determine whether a Deferred object has been resolved.
 * @property {function} isRejected - Determine whether a Deferred object has been rejected.
 * @property {function(function, function)} pipe - Utility method to filter and/or chain a {@link Deferred} object.
 */




Knuckles.service.define({
    name: '$deferred',
    deps: [],
    factory: function(){
        $deferred.when = $when;
        return $deferred;
    }
});



Knuckles.service.define({
    name: '$async',
    deps: ['$deferred'],
    factory: function($deferred){

        var setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            pendingDeferIds = {},
            outstandingRequestCount = 0,
            outstandingRequestCallbacks = [],
            deferreds = {};

        function defer(fn, delay){
            var timeoutId;
            outstandingRequestCount++;
            timeoutId = setTimeout(function() {
                delete pendingDeferIds[timeoutId];
                completeOutstandingRequest(fn);
            }, delay || 0);
            pendingDeferIds[timeoutId] = true;
            return timeoutId;
        }

        function cancel(deferId) {
            if (pendingDeferIds[deferId]) {
                delete pendingDeferIds[deferId];
                clearTimeout(deferId);
                completeOutstandingRequest(noop);
                return true;
            }
            return false;
        }

        function completeOutstandingRequest(fn){
            try {
                fn.apply(null, slice.call(arguments, 1));
            } finally {
                outstandingRequestCount--;
                if (outstandingRequestCount === 0) {
                    while(outstandingRequestCallbacks.length) {
                        try {
                            outstandingRequestCallbacks.pop()();
                        } catch (e) {
                            $fail(e);
                        }
                    }
                }
            }
        }

        function timeout(fn, delay){
            var deferred = $deferred(),
                timeoutId, cleanup;

            timeoutId = defer(function() {
                try {
                    deferred.resolve(fn());
                } catch(e) {
                    deferred.fail(e);
                    $fail(e);
                }
            }, delay);

            cleanup = function() {
                delete deferreds[deferred.$$timeoutId];
            };

            deferred.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            deferred.always(cleanup);

            return deferred;
        }

        function interval(fn,delay){
            function step(){
                fn.apply(this,arguments);
                timeout(step,delay);
            }
            timeout(step,delay);
        }

        return {
            defer: defer,
            cancel: cancel,

            timeout: timeout,
            interval: interval
        }
    }
});

Knuckles.service.define({
    name: '$localStorage',
    deps: [],
    factory: function(){
        return localStorage;
    }
});

Knuckles.service.define({
    name: '$bind',
    deps: [],
    factory: function(){
        return applyBindings;
    }
});


var ctorKey = '__ko_typed_array_ctor__',
    underlyingKey = '__ko_typed_array_underlying__',
    toArray = function(args){
        return slice.call(args, 0).sort();
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
    newMethods = {
        'splice': function () {
            var that = this[underlyingKey];
            var needToMap = false,
                mappedArguments;
            if(arguments[2] !== undefined && !(arguments[2] instanceof this[ctorKey])){
                needToMap = true;
                mappedArguments = cmap(toArray(arguments).slice(2),that[ctorKey]);
                mappedArguments.unshift(arguments[0],arguments[1]);
            }

            // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
            // (for consistency with mutating regular observables)
            var underlyingArray = that.peek();
            that.valueWillMutate();
            var methodCallResult = underlyingArray['splice'].apply(underlyingArray, needToMap ? mappedArguments : arguments);
            that.valueHasMutated();
            return methodCallResult;
        }
    };

each(['remove','removeAll','destroy','destroyAll','replace'],function(methodName){
    newMethods[methodName] = function (valueOrPredicate) {
        var that = this[underlyingKey];
        that[methodName].apply(that,arguments);
    }
});


each(["push", "unshift"], function (methodName) {
    newMethods[methodName] = function () {
        var that = this[underlyingKey];
        var needToMap = false,
            mappedArguments;
        if(arguments[0] !== undefined && !(arguments[0] instanceof that[ctorKey])){
            needToMap = true;
            mappedArguments = cmap(toArray(arguments),that[ctorKey]);
        }

        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = that.peek();
        that.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, needToMap ? mappedArguments : arguments);
        that.valueHasMutated();
        return methodCallResult;
    };
});


observableArray.fn.ofType = function(Ctor){
    var underlying = this,
        interceptor = computed({
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

    extend(interceptor, observableArray['fn'], newMethods)
    underlying[ctorKey] = Ctor;
    interceptor[underlyingKey] = underlying;

    return interceptor;
};


});


}());
