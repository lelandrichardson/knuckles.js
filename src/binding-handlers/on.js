//TODO: jQuery dependency
//delegated event handling via $.on
ko.bindingHandlers.on = {
    init: function(element, valueAccessor){
        var eventsToHandle = unwrap(valueAccessor() || {});
        $.each(eventsToHandle, function(key) {
            if (typeof key == "string") {
                var eventName = key.substr(0,key.indexOf(" ")),
                    selector = key.substr(key.indexOf(" ") + 1);

                $(element).on(eventName, selector,function(event){
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[key];
                    if (!handlerFunction){return;}

                    var context = ko.contextFor(this);

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = Array.prototype.slice.call(arguments);
                        argsForHandler.unshift(context.$data);
                        handlerReturnValue = handlerFunction.apply(context.$data, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }
                    //cancel bubbling by default
                    event.cancelBubble = true;
                    if (event.stopPropagation)
                        event.stopPropagation();
                });
            }
        });
    }
};