//formats a Date object to "time ago" string
//TODO: move this to some globally available function
var toTimeAgo = function () {
    var secs = (((new Date()).getTime() - this.getTime()) / 1000),
        days = Math.floor(secs / 86400);

    return days === 0 && (
        secs < 60 && "just now" ||
            secs < 120 && "a minute ago" ||
            secs < 3600 && Math.floor(secs / 60) + " minutes ago" ||
            secs < 7200 && "an hour ago" ||
            secs < 86400 && Math.floor(secs / 3600) + " hours ago") ||
        days === 1 && "yesterday" ||
        days < 31 && days + " days ago" ||
        days < 60 && "one month ago" ||
        days < 365 && Math.ceil(days / 30) + " months ago" ||
        days < 730 && "one year ago" ||
        Math.ceil(days / 365) + " years ago";
};

// binding handler to take in JSON ISO 8601 date string, return <time> element formatted
ko.bindingHandlers.timeAgo = {
    init: function () {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor) {
        //NOTE: for now, we are using Date() constructor with ISO 8601 - **this is not compatibile with IE8**
        var val = unwrap(valueAccessor()),
            date = new Date(val),
            timeAgo = toTimeAgo.call(date);
        return ko.bindingHandlers.html.update(element, function () {
            return '<time datetime="' + val + '">' + timeAgo + '</time>';
        });
    }
};