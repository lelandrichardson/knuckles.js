// key event handlers
var keyBinderFactory = function(keyCode){
    return {
        init: function(event, valueAccesor, allBindings, data) {
            var newValueAccessor = function() {
                return {
                    keyup: function(data, event) {
                        if(event.keyCode === keyCode) {
                            valueAccessor().call(data, data, event);
                        }
                    }
                };
            };
            ko.bindingHandlers.event.init(element,newValueAccessor,allBindings,data);
        }
    };
};
extend(ko.bindingHandlers,{
    enterKey: keyBinderFactory(13),
    escapeKey: keyBinderFactory(27),
    tabKey: keyBinderFactory(9),
    leftArrowKey: keyBinderFactory(37),
    rightArrowKey: keyBinderFactory(39),
    upArrowKey: keyBinderFactory(38),
    downArrowKey: keyBinderFactory(40)
});