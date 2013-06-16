bindingHandlers.currency = {
    update: function(element, valueAccessor,allBindingsAccessor){
        return bindingHandlers.text.update(element,function(){
            var value = unwrap(valueAccessor()),
                currencySymbol= allBindingsAccessor().currencySymbol;
            return formatting.currency(+value, currencySymbol);
        });
    }
};