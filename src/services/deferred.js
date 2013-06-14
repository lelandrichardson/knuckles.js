
/**
 * A version of the Promise Monad used by Knuckles.  As of now this is essentially a wrapper around the jQuery
 * implementation.
 *
 * @name Deferred
 * @typedef {Object} Deferred
 * @property {function(function)} always - Add handlers to be called when the Deferred object is either resolved or
 *      rejected.
 * @property {function(function)} done - Add handlers to be called when the Deferred object is resolved.
 * @property {function(function)} fail - Add handlers to be called when the Deferred object is rejected.
 * @property {function(function,function)} then - Add handlers to be called when the Deferred object is resolved,
 *      rejected, or still in progress.
 * @property {function} state - Determine the current state of a Deferred object.
 * @property {function} promise - Return a {@link Promise} object to observe when all actions of a certain type bound to the
 *      collection, queued or not, have finished.
 * @property {function} isResolved - Determine whether a Deferred object has been resolved.
 * @property {function} isRejected - Determine whether a Deferred object has been rejected.
 * @property {function(function, function)} pipe - Utility method to filter and/or chain a {@link Deferred} object.
 */


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

