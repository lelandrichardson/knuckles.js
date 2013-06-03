/*
Things I'd like to cover:

    AMD / require.js
    Mapping from JS/JSON
    RESTful conventions
    Collection helpers
        filtering
        querying
        grouping
        paging
        infinite scroll
        feed???
        etc.
    Model helpers
        form-based scenarios

    Model inheritence
    Validation
    Formatting + Common UI problems/patterns

    "sync" (like backbone)

    "protected" observables?
    model editor pattern

    a ".hide()" extensions method to prevent object from being serialized by ko.toJSON?


    jquery widgets
        calendar
        menu?
        slider
        popover (with templating)
        fadeIn/fadeOut
        dialog box / modal / lightbox


    combo box widget
    autocomplete (templated ?!)


    More Binding handlers:
        foreach augmentation: (limit to, orderBy, etc)
        isInView (or maybe it should be called waypoint?) (jquery plugin for this: https://github.com/zuk/jquery.inview)
        tooltip
        switch-case control flow bindings  (https://github.com/mbest/knockout-switch-case)
        click-toggle
        click-increment
        click-decrement
        module -> rpn library (https://github.com/rniemeyer/knockout-amd-helpers)
        xxdateFormat -> (https://github.com/phstc/jquery-dateFormat)
    observable dictionary...


    Services (like angular):
        $timeout
        $http
        $controller

        application-wide pub-sub (https://github.com/rniemeyer/knockout-postbox)

    Templating...
    can we utilize AMD/require here?



    some bootstrap binding handlers (good stuff):
    https://github.com/billpull/knockout-bootstrap/blob/master/src/knockout-bootstrap.js

    kendoui binding handlers:
    https://github.com/kendo-labs/knockout-kendo/tree/master/src

    masked inputs:
    https://github.com/thelinuxlich/knockout_bindings/blob/master/knockout_bindings.js#L27

    jqueryUI bindingHandlers
    https://github.com/gvas/knockout-jqueryui/tree/master/src

    interesting approach to forms (backbone):
    https://github.com/powmedia/backbone-forms

    take a look at this paging framework:
    https://github.com/wyuenho/backbone-pageable

    jquery validation:
    https://github.com/jzaefferer/jquery-validation

    jquery timeago:
    x https://github.com/rmm5t/jquery-timeago


    UNIT TESTING!!!





*/
(function(){
    //global object
    var root = this;


    var previousKnuckles = root.Knuckles;


    var Backbone;
    if (typeof exports !== 'undefined') {
        Knuckles = exports;
    } else {
        Knuckles = root.Knuckles = {};
    }

    Knuckles.VERSION = "0.0.1";



    Knuckles.noConflict = function() {
        root.Knuckles = previousKnuckles;
        return this;
    };




}).call(this);


// The potential API
// -------------------------------------------------------------
var kn = Knuckles;

// create a model
var Cocktail = Knuckles.ViewModel.define(function(spec){
    var self = this;
    self.id = kn.Identifier();
    self.name = kn.String();
    self.type = kn.String();
    self.rating = kn.positiveInt();

    self.populate(spec());
});

// create a model
var Cocktail = Knuckles.ViewModel.define({
        resource: 'cocktail'
    },
    function(spec){
        var self = this;
        self.id = null;
        self.name = ko.observable();
        self.type = ko.observable();
        self.rating = null;

        self.populate(spec);
    }).ajaxify();


define([
    "$ajax",
    ""
],function($ajax){

    var Cocktail = Knuckles.ViewModel.define({
            resource: 'cocktail'
        },
        function(spec){
            var self = this;
            self.id = null;
            self.name = ko.observable();
            self.type = ko.observable();
            self.rating = null;

            self.populate(spec);


        });

    restify(Cocktail,$ajax);

});










Knuckles.Application.define({
    needs: ['Cocktail'],
    run: function(Cocktail){
        var cocktail = Cocktail.get(123);

    }
});


Knuckles.Model.define({
    name: 'Cocktail',
    needs: ['$http','$async','Ingredient'],
    factory: function(spec, $http, $async, Ingredient){
        var self = this;

        self.id = ko.observable();
        self.name = ko.observable();

        self.ingredients = ko.observable().ofType(Ingredient);
    },
    implements: ['restify']
});

Knuckles.Model.define({
    name: 'Ingredient',
    factory: function(spec){
        this.id = ko.observable();
        this.name = ko.observable();
    },
    implements: ['restify']
});







