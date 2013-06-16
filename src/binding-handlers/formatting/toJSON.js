bindingHandlers.toJSON = {
    update: function(element, valueAccessor){
        return bindingHandlers.text.update(element,function(){
            return toJSON(valueAccessor(),null,2);
        });
    }
};