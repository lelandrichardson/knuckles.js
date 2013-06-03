bindingHandlers.selectAndFocus = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
        registerEventHandler(element, 'focus', function () {
            element.focus();
        });
    },
    update: function (element, valueAccessor) {
        unwrap(valueAccessor()); // for dependency
        // ensure that element is visible before trying to focus
        setTimeout(function () {
            bindingHandlers.hasfocus.update(element, valueAccessor);
        }, 0);
    }
};