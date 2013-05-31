ko.bindingHandlers.keys = {
    init: function (element, valueAccessor, allBindings, vm) {
        var actions = ko.utils.unwrapObservable(valueAccessor()) || {},
            handler = function (event) {
                var action = actions['key' + event.keyCode],
                    modifier = ko.utils.unwrapObservable(allBindings().modifier),
                    result;

                if (action) {
                    if (modifier && !event[modifier]) {
                        return true;
                    }

                    result = action.call(vm, vm, event);

                    return result === undefined ? false : result;
                }
            };

        ko.utils.registerEventHandler(element, 'keyup', handler);
    }
};