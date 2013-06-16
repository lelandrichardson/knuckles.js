#Knuckles.js: Help Knockout.js pack a punch

Knuckles.js is a web-application framework built around the power of Knockoutjs.  Knockout.js is incredibly powerful as a plumbing library between your view (HTML) and ViewModel (JS), but it does very little to help us structure large web applications.  This is because Knockout is a library, not a framework.  Knuckles helps provide structure to your web applications.

Knuckles.js is the framework you always wanted for Knockout, but never had.

###Inception

I am an avid user of Knockout.js.  When I first started with Knockout I loved it's simplicity, but once I started trying to do anything complex... I found myself with terribly unmaintainable and unreadable code.

I adapted, and began to learn better and more advanced ways to use Knockout and stay DRY.  After awhile, I had developed several useful "tools" or "utilities" that were completely generic and I thought could help people if I released them as a sort of "utility" belt.

After working a bit with Angular.js, I found that the Dependency Injection pattern that it uses is incredibly powerful and makes building large applications much easier and more testable.

Ultimately, I decided to build a framework that used Knockout as the plumbing.  Knuckles was born.


###Dependencies

Knuckles.js has a hard dependency on [Knockout.js](https://github.com/knockout/knockout) and [jQuery](https://github.com/jquery/jquery).  Additionally, in order to enable modularization and templates, [require.js](https://github.com/jrburke/requirejs) or some other AMD module is required. If excluded, these features are simply disabled.

###What does Knuckles Provide?


- **Binding Handlers**:<br>
  The binding handlers provided by Knockout are great, but to conserve bytes, only the bare minimum of binding handlers were defined.  Knuckles extends the set of binding handlers to encompass many more complex but common UI interactions that help keep your markup as clean as possible and free of boiler-plate.

- **Widgets**:<br>
  Several widgets have also been defined in order to build complex UI's right out of the box. (Note: I have plans to build a widget builder/factory to easily create your own widget bindings)

- **Extensible Design Patterns**:<br>
  Knuckles provides a clean pattern for writing large web applications while staying DRY and removing a lot of the boiler-plate code symptomatic of more involved knockout applications.  These patterns manifest themselves in the way of mixin-style inheritence, extension methods, and common model types such as Collections, Enums, Editors, etc.

- **Modularization**:<br>
  Knuckles 

- **Testability**:<br>
  Knuckles comes with the notion of Inversion of Control built in every step of the way, which helps one decouple their application logic  from their view logic, and their view logic from the environment (ie, the DOM).  This allows one to easily create test fixtures to build comprehensive Unit Tests as easily as possible.



##Dependency Injection


##View Models

Knuckles View models follow a constructor pattern.  JavaScripters familiar with this pattern might be used to defining models like this:

    function Ingredient(spec){
        //instance properties
        this.id = ko.observable(spec.id);
        this.name = ko.observable(spec.name);
        this.amount = ko.observable(spec.amount || 0);
        this.unit = ko.observable(spec.name || 'ounces');
    }

In Knuckles, one could define this very similarly with `Knuckles.viewModel.define()`:

    Knuckles.viewModel.define(function Ingredient(spec){
        // instance properties
        this.id = ko.observable();
        this.name = ko.observable();
        this.amount = ko.observable();
        this.unit = ko.observable();
        
        // initialize
        this.$populate(spec);
    });

Here we are taking advantage of the `$populate` method, which is defined on all Knuckles view models and maps javascript data to models, taking into account whether or not they are `ko.observable` or not (similar to [Knockout.mapping](http://knockoutjs.com/documentation/plugins-mapping.html)).

###Prototype Methods

Alternatively, one could define the view model using the more extensible API:

    Knuckles.viewModel.define({
        name: 'Ingredient',
        factory: function(spec){
            // instance properties
            this.id = ko.observable();
            this.name = ko.observable();
            this.amount = ko.observable();
            this.unit = ko.observable();
            
            // initialize
            this.$populate(spec);
        },
        fn: {
            $populate: function(data){
                // override default behavior
            },
            otherMethod: function(){
                // define any additional prototype methods
            }
        }
    });

Using this API, we can be a little bit more declarative with our `Ingredient` type.  We see we define a name with a string.  This name is the identifier that is used in Knuckles' dependency resolver.

###Classes within Classes

Often times we want to use 

    Knuckles.viewModel.define({
        name: 'Recipe',
        deps: ['Ingredient'],
        factory: function(spec, Ingredient){
            //instance properties
            this.id = ko.observable();
            this.name = ko.observable();
            this.difficulty = ko.observable();
            
            this.ingredients = kn.observableArrayOf(Ingredient)();
            
            this.$populate(spec);
        }
    });


There are two important things to note here.

1. The `deps: ['Ingredient']` property
2. The second parameter to the `factory` method named `Ingredient` here

The `deps` property is an array of resource names as defined by the Knuckles IOC Container.  The example above is indicating that we are 



###Declaring Dependencies

ViewModels (and all other resources using the IOC Container of Knuckles) are 





###ViewModelBase Abstract Class




##Mixin-Style Inheritence

All view models in Knuckles can be "extended" via the use of mixins.  Mixins can be an incredibly powerful way to share behavior across several different types.

At the base of it, extenders add prototype methods (or instance method) to a view model which you have defined.

Often times these are very simple methods which declare no dependencies and have no configuration. They simply work the same every time:

    Knuckles.extenders.define({
        name: 'HelloWorld',
        fn: {
            sayHello: function(){
                alert("Hello " + this.name + "!");
            }
        }
    });

Now, I can have another viewModel use this extender:


    Knuckles.viewModel.define({
        name: 'Person',
        factory: function(spec){
            this.name = spec.name;
        },
        extenders: {
            'HelloWorld': true
        }
    });

    Knuckles.run(['Person'],function(Person){
        var person = new Person({name: "John"});
    
        person.sayHello(); // alerts "Hello John!"
    
    });

Extenders can get quite a bit more advanced however:

    Knuckles.extenders.define({
        name: 'CRUD',
        deps: ['$http'],
        defaults: {
            // define default 'config' values here
        },
        fn: function(config, $http){
            // extenders can declare their own dependencies...
            // and have config objects passed in
    
            // and thus you pass in a function which enjoys the
            // closure of the dependencies and returns the
            // extender methods
            
            // here you are required to return an object hash
            // consisting of the prototype methods you would
            // like to have 'CRUD' augment.
            return {
                create: function(){ 
                    return $http.put({url: config.createUrl /*, ... */});
                },
                update: function(){ 
                    return $http.post({url: config.updateUrl /*, ... */});
                },
                destroy: function(){ 
                    return $http.delete({url: config.destroyUrl /*, ... */});
                }
            };
        }
    });

And thus, one could use this extender like so:

    Knuckles.viewModel.define({
        name: 'Person',
        factory: function(spec){
            this.name = spec.name;
        },
        extenders: {
            'CRUD': {
                createUrl: '/person/update',
                updateUrl: '/person/update',
                destroyUrl: '/person/destroy'
            }
        }
    });
    
    Knuckles.run(['Person'],function(Person){
        var person = new Person({name: "John"});
    
        person.create(); // creates person on server.
        
        person.name = "Bob";
        person.update(); // updates person on server
    });


##Provided Extensions



##Provided Services

**The `$http` Service**<br>
A service for making AJAX requests.  This is essentially a proxy to `$.ajax` but provides several convenience methods, and has some different defaults.

- `$http.get()` make a GET request
- `$http.put()` make a PUT request
- `$http.post()` make a POST request
- `$http.delete()` make a DELETE request
- `$http()` make an AJAX request with whatever configuration you send across it.

The defaults used assume a JSON based web service, and will also perform the processing of the JSON and unwrapping of observables.



**The `$localStorage` Service**<br>
Get access to the browser's `localStorage` object.

- `$localStorage.get(string key)` returns a parsed JS object
- `$localStorage.set(string key)` stores an arbitrary JS object
- `$localStorage.getItem(string key)` returns the raw string stored via localStorage
- `$localStorage.getString(string key)` direct alias to `$localStorage.getItem`
- `$localStorage.isSupported` a boolean indicating whether or not localStorage is supported on the current browser.  In cases where it is not, the above methods are still available, but they are not functional.

Note: there is plan to improve the localStorage object to provide some fallback mechanisms to support a wider range of browsers.

**The `$async` Service**<br>
This is essentially a wrapper around the native methods for `setTimeout` `setInterval` and `setImmediate`, which are typically very difficult to test.

The exposed methods are:

- `$async.timeout`
- `$async.interval`
- `$async.cancel`
- `$async.defer`



**The `$deferred` Service**<br>
This service is essentially a proxy to [jQuery's `$.Deferred` promise implementation](http://api.jquery.com/jQuery.Deferred/).

##Provided Binding Handlers

###Convenience Bindings

Largely just to reduce clutter and improve readability in the markup, several convenience bindings have been provided:

- `src: url` a shortcut for `attr: {src: url}`
- `href: url` a shortcut for `attr: {href: url}`
- `title: string` a shortcut for `attr: {title: url}`
- `dynamicValue: property` a shortcut for `value: property, valueUpdate: 'afterkeydown'`
- `hidden: bool` a shortcut for `visible: !bool()`
- `clickIncrement: val` a shortcut for `click: function(){val(val()+1);}`
- `clickDecrement: val` a shortcut for `click: function(){val(val()-1);}`
- `clickToggle: val` a shortcut for `click: function(){val(!val());}`

###Formatting

Formatting is something that belongs in bindings, but is often put into the ViewModel's logic as computed observables which clutters the ViewModel logic significantly.  Several helpers bindings are thus provided:

- `currency: val`: This binding accepts any number and will assume that it is a currency value.  User can specify the locale currency string as a binding option, or as a global default through `Knuckles.formatting.currency.defaultSymbol`.

- `date: dateVal, dateFormat: 'dd-mm-yyyy'`: formatting dates is always a big pain.  Knuckles comes with this date binding which will accept `string` or `Date` values, allong with a binding option `dateFormat` which allows a configurable format string.

- `timeAgo: dateVal`: It is becoming much more common for applications to not display an actual date on the UI, but rather a relative time string saying "how long ago" something happened.  For example, '6 days ago' or '6 seconds ago'.  Of course, time is fleeting, and the value of this string will potentially be changing constantly even if the value is not...  Knuckles takes care of all that for you.  Moreover, this get's rendered in the document as `<time datetime="2013-06-11T21:49:40.58">4 days ago</time>` which has the benefit of being machine readable.

 
###Capture Keystrokes

Often times we as web developers can greatly enhance the experience of a web app with thoughtful keystroke operations and interceptions.

Knuckles provides a `keys` binding which proxies the 'keyup' event and works like the following:

    <textarea data-bind="keys: { key77: letterMWasPressed, key78: letterNwasPressed }"><textarea>

Any keycode will work.  Here keycodes 77 and 78 were shown.  Of course, this isn't ideal in many cases as we don't often know which keycodes are which.  Several common keystrokes have their own shortcut bindings:

    <textarea data-bind="enterKey: enterWasPressed, tabKey: tabWasPressed"><textarea>

The full list of convenience bindings is:

- `enterKey`
- `escapeKey`
- `tabKey`
- `leftArrowKey`
- `rightArrowKey`
- `upArrowKey`
- `downArrowKey`


###Delegated Events

Delegated event binding is important for performance.  Binding events to the DOM is expensive.  This is especially important with `foreach` or `template` bindings where those binding handlers are running for each and every element being rendered.  It's often much more desired to delegate an event handler to the parent container...  This can be done using Knuckles' `on` binding handler.

For example, instead of doing this:

    <ul data-bind="foreach: rows">
        <li>
            <span data-bind="text: title></span>
            <a data-bind="click: $parent.remove">&times</a>
        </li>
    </ul>

One could instead do the following:

    <ul data-bind="foreach: rows, on: {'click .remove': remove}">
        <li>
            <span data-bind="text: title></span>
            <a class="remove">&times</a>
        </li>
    </ul>

This syntax is similar to Backbone's event object hash.  The properties on the object bound to the handler will have property names of the pattern `'{event-name} {selector}'`, which can be thought of as calling `$(element).on("{event-name}","{selector}", handler)` on the jQuery library (which indeed is what is actually happening in the background).


##Templating via Require.js

Using the work of Ryan Niemeyer with his [knockout-amd-helpers](https://github.com/rniemeyer/knockout-amd-helpers) project, Knuckles has the ability to reference external templates via the AMD loader's text plugin.  This allows you to create HTML templates in their own `.tmpl.html` file, and reference them using knockout's `template` binding handler without having to worry about loading it onto the page in a `<script>` tag.  This allows you to be much more DRY with your templates.


##License

Use of Knuckles.js is permitted under the MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php) for optimum compatibility with Knockout.