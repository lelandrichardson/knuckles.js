bindingHandlers.hidden = {
    update: function (element, valueAccessor) {
        var value = unwrap(valueAccessor());
        bindingHandlers.visible.update(element, function () { return !value; });
    }
};