bindingHandlers.dynamicValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        bindingHandlers.value.init(element,valueAccessor,
            observable(extend(allBindingsAccessor(),{valueUpdate: 'afterkeydown'}))
        );
    },
    update: bindingHandlers.value.update
};