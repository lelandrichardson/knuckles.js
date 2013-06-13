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