//TODO: move formatting function to some global "currency" format function
ko.bindingHandlers.currency = {
    update: function(element, valueAccessor){
        //TODO: look at allBindings to look for a non-default dollar sign
        return ko.bindingHandlers.text.update(element,function(){
            var value = ko.utils.unwrapObservable(valueAccessor());
            return '$' + (value || 0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        });

    }
};