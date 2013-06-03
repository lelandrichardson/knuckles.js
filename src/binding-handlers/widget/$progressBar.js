if($.fn.progressbar){
    ko.bindingHandlers.progressBar = {
        init: function(element,valueAccessor){
            $(element).progressbar({ value: unwrap(valueAccessor())});
        },
        update: function(element,valueAccessor){
            $(element).progressbar("option","value",unwrap(valueAccessor()));;
        }
    }
}