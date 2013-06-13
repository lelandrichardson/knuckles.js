requirejs.config({
    paths: {
        'Knuckles': "../../build/output/knuckles-latest",
        'knockout': "../lib/knockout-2.2.1",
        'jquery': "../lib/jquery.min",
        'jquery-ui': "../lib/jquery-ui.min",
        "text": "../lib/text"
    },
    shim: {
        'Knuckles': {
            exports: 'Knuckles'
        }
    }
});



require(["Knuckles","knockout","text"],
function(Knuckles,ko) {
    ko.bindingHandlers.module.baseDir = "modules";

    var App = function() {
        this.articlePath = "articles";
        this.currentArticle = ko.observable("one");
        this.currentArticle.full = ko.computed(function() {
            var current = this.currentArticle();
            return current && this.articlePath + "/" + current;
        }, this);
    };



    ko.applyBindings(new App());
});
