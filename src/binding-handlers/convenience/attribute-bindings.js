(function(){
    var factory = function(config){
        bindingHandlers[config.binding] = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                bindingHandlers.attr.update(element,function(){var r = {}; r[config.attr] = valueAccessor();return r;},allBindingsAccessor);
            }
        };
    };
    var attributes = [
        {attr: "href", binding: "href"},
        {attr: "src", binding: "src"},
        {attr: "title", binding: "title" }
    ];
    for(var i = 0; i < attributes.length; i++){
        factory(attributes[i]);
    }
})();