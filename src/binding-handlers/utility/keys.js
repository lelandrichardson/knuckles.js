bindingHandlers.keys = {
    init: function (element, valueAccessor, allBindings, vm) {
        var actions = unwrap(valueAccessor()) || {},
            handler = function (event) {
                var action = actions['key' + event.keyCode],
                    modifier = unwrap(allBindings().modifier),
                    result;

                if (action) {
                    if (modifier && !event[modifier]) {
                        return true;
                    }

                    result = action.call(vm, vm, event);

                    return result === undefined ? false : result;
                }
            };

        registerEventHandler(element, 'keyup', handler);
    }
};