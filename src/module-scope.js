
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