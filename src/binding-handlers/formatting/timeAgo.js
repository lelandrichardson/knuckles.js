// binding handler to take in JSON ISO 8601 date string, return <time> element formatted
bindingHandlers.timeAgo = {
    init: function () {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor) {
        //NOTE: for now, we are using Date() constructor with ISO 8601 - **this is not compatibile with IE8**
        var val = unwrap(valueAccessor()),
            date = new Date(val),
            timeAgo = formatting.timeAgo(date);
        return bindingHandlers.html.update(element, function () {
            return '<time datetime="' + date.toISOString() + '">' + timeAgo + '</time>';
        });
    }
};