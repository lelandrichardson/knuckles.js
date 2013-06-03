
each({
    clickIncrement: function(val){
        val(val()+1);
    },
    clickDecrement: function(val){
        val(val()-1);
    },
    clickToggle: function(val){
        val(!val());
    }
},
function(func,bindingName){
    var abc = 1;
    bindingHandlers[bindingName] = {
        init: function (element,valueAccessor) {
            return bindingHandlers.click(element,function(){
                //this is the actual event handler...  it is going to call func(value);
                return function(){ func(valueAccessor());}
            });
        }
    };
});