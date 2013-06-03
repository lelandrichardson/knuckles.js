ko.bindingHandlers.currency = {
    update: function(element, valueAccessor,allBindingsAccessor){
        return ko.bindingHandlers.text.update(element,function(){
            var value = unwrap(valueAccessor()),
                currencySymbol= allBindingsAccessor().currencySymbol;
            return Knuckles.formatting.currency(+value, currencySymbol);
        });
    }
};