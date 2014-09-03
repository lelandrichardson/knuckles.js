subscribable.fn.asProtected = function () {
    //private variables
    var underlying = this,
        _temp = underlying();

    //computed observable that we will return
    var interceptor = ko.computed({

        // always return the actual value
        read: underlying,

        // stored in a temporary spot until commit
        write: function (newValue) {
            _temp = newValue;
        }
    });

    //if different, commit temp value
    interceptor.commit = function () {
        if (_temp !== underlying()) {
            underlying(_temp);
        }
    };

    //force subscribers to take original
    interceptor.reset = function () {
        underlying.notifySubscribers();
        _temp = underlying();   //reset temp value
    };

    interceptor.safeExtend(this);
    interceptor.addExports(['reset', 'commit']);

    return interceptor;
};