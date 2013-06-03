ko.bindingHandlers.date = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        return ko.bindingHandlers.text.update(element, function () {
            var val = unwrap(valueAccessor()),
                dateFormat = allBindingsAccessor().dateFormat,
                date = new Date(val),
                formatted = Knuckles.formatting.date(date, dateFormat);
            return formatted;
        });
    }
};