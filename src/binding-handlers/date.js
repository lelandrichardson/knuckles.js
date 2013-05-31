//TODO: refactor to use own date format function, and move function to global formatting function
if($.datepicker){
    ko.bindingHandlers.date = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            return ko.bindingHandlers.text.update(element, function () {
                var val = unwrap(valueAccessor()),
                    dateFormat = allBindingsAccessor().dateFormat || 'mm-dd-yyyy',
                    date = new Date(val),
                    formatted = $.datepicker.formatDate(dateFormat, date);
                return formatted;
            });
        }
    };
}