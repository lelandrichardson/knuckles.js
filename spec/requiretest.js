
// APP DECLARATION
// --------------------------------------------------------

var container = Knuckles.container;
container.define({
    name: 'test1',
    deps: [],
    factory: function(){

        return {
            identity: "test1"
        };
    }
});

container.define({
    name: 'test2',
    deps: ['test1'],
    factory: function(test1){

        return {
            identity: "test 2 with dependencies on " + test1.identity
        };
    }
});

container.define({
    name: 'test3',
    deps: ['test2'],
    factory: function(test2){

        return {
            identity: "test 3 with dependencies on " + test2.identity
        };
    }
});

container.define({
    name: 'test4',
    deps: ['test2','test1'],
    factory: function(test2,test1){

        return {
            identity: "test 3 with dependencies on " + test2.identity + " and " + test1.identity
        };
    }
});

container.use(['test4'],function(test4){
    alert(test4.identity);
});






Knuckles.extenders.define({
    name: 'publishable',
    deps:['$http'],
    factory: function(config,$http){
        return {
            publish: function(){
               $http.post({
                   url: config.rootUri + '/publish',
                   data: this.id
               });
            }
        };
    }
});



Knuckles.extenders.define({
    name: 'animal',
    deps:['$http'],
    factory: function(config,$http){
        return {
            publish: function(){
                $http.post({
                    url: config.rootUri + '/publish',
                    data: this.id
                });
            }
        };
    }
});



Knuckles.extenders.define({
    name: 'restify',
    deps:['$http'],
    static: function(config,$http){
        return {
            get: function(id){
                $http.post({
                    url: config.rootUri + '/' + id,
                    data: this.id
                });
            }
        };
    },
    fn: function(config,$http){
        return {
            publish: function(){
                $http.post({
                    url: config.rootUri + '/publish',
                    data: this.id
                });
            }
        };
    }
});

Knuckles.extenders.define({
    name: 'restify',
    static: {
        toString: function(id){
            return 'abc' + this.toString();
        }
    },
    fn: {
        debug: function(){
            console.log(ko.toJS(this));
        }
    }
});


Knuckles.viewModel.define({
    name: 'FeedView',
    deps: ['$http','$deferred','$timeout'],
    factory: function(spec,$http,$deferred,$timeout){
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();


        self.$populate(spec);
    },
    extenders: {
        'publishable': {
            rootUri: '/feed'
        }
    }
});


Knuckles.viewModel.define({
    name: 'Ingredient',
    deps: [],
    factory: function(spec){
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();


        self.$populate(spec);
    }
});

function Ingredient(spec){
    //instance properties
    this.id = ko.observable(spec.id);
    this.name = ko.observable(spec.name);
    this.amount = ko.observable(spec.amount || 0);
    this.unit = ko.observable(spec.name || 'ounces');
}



Knuckles.viewModel.define(function Ingredient(spec){
    //instance properties
    this.id = ko.observable(spec.id);
    this.name = ko.observable(spec.name);
    this.amount = ko.observable(spec.amount || 0);
    this.unit = ko.observable(spec.name || 'ounces');
});

Knuckles.viewModel.define({
    name: 'Ingredient',
    deps: [],
    factory: function(spec){
        //instance properties
        this.id = ko.observable(spec.id);
        this.name = ko.observable(spec.name);
        this.amount = ko.observable(spec.amount || 0);
        this.unit = ko.observable(spec.name || 'ounces');
    }
});


Knuckles.viewModel.define({
    name: 'Recipe',
    deps: ['Ingredient'],
    factory: function(spec,Ingredient){
        //instance properties
        this.id = ko.observable();
        this.name = ko.observable();
        this.difficulty = ko.observable();

        this.ingredients = kn.observableArrayOf(Ingredient)();

        this.$populate(spec);
    }
});


Knuckles.enum.define('Unit',['ounce','gram','splash','cup','tbsp']);

Knuckles.enum.define('Unit',{
    '1':'ounce',
    '2':'gram',
    '3':'splash',
    '4':'cup',
    '5':''
});

Knuckles.enum.define({
    name:'Unit',
    values: {
        '1':'ounce',
        '2':'gram',
        '3':'splash',
        '4':'cup',
        '5':''
    },
    default: '1'
});

Knuckles.enum.define({
    name:'Unit',
    values: ['ounce','gram','splash','cup','tbsp'],
    indexStart: 1,
    default: '1'
});

Knuckles.enum.define({
    name:'Unit',
    values: [
        {id: 1,label:'ounce',abbr:'oz'},
        {id: 1,label:'gram',abbr:'g'}
    ],
});


Knuckles.extenders.define({
    name: 'HelloWorld',
    fn: {
        sayHello: function(){
            alert("Hello " + this.name + "!");
        }
    }
});


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