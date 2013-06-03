ko.bindingHandlers.dynamicValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        ko.bindingHandlers.value.init(element,valueAccessor,
            ko.observable(extend(allBindingsAccessor(),{valueUpdate: 'afterkeydown'}))
        );
    },
    update: ko.bindingHandlers.value.update
};