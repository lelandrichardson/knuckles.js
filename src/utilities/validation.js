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