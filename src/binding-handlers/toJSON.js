ko.bindingHandlers.toJSON = {
    update: function(element, valueAccessor){
        return ko.bindingHandlers.text.update(element,function(){
            return ko.toJSON(valueAccessor(),null,2);
        });
    }
};