// APP DECLARATION
// --------------------------------------------------------

var todomvc = Knuckles.module('todomvc',[]);


// BINDING HANDLERS
// --------------------------------------------------------
Knuckles.bindingHandler({
    name: 'todoFocus',
    init: function(){

    },
    update: function(){

    }
});

todomvc.bindingHandler({
    name: 'todoFocus',
    deps: ['$async'],
    factory: function ($async) {
        return {
            init: function(){

            },
            update: function(){

            }
        };
    }
});


// MODULE SERVICES
// ------------------------------------------------------------


// storage service...
todomvc.service({
    name: 'todoStorage',
    deps: [$localStorage,$JSON],
    factory: function () {
        var STORAGE_ID = 'todos-knuckles';

        return {
            get: function () {
                return JSON.parse($localStorage.getItem(STORAGE_ID) || '[]');
            },

            put: function (todos) {
                $localStorage.setItem(STORAGE_ID, $JSON.stringify(todos));
            }
        }
    }
});





// MODULE VIEW MODELS
// ------------------------------------------------------------


todomvc.viewModel({
    name: 'TodoItem',
    factory: function(spec){
        var self = this;
        self.title = ko.observable(spec.title);
        self.completed = ko.observable(spec.completed);
        self.editing = ko.observable(false);
    },
    proto: {

    }
});



todomvc.viewModel({
    name: 'TodoVM',
    deps: ['TodoItem','$http', 'todoStorage'],
    init: function(spec, TodoItem, $http, todoStorage){
        var self = this;
        self.current = ko.observable();

        self.newTodo = ko.observable();
        self.editedTodo = null;

        self.showMode = ko.observable('all');


        self.$populate(spec);

        // To Do Collection
        // ------------------------------------------
        self.todos = ko.observableArray().ofType('TodoItem');

        self.filteredTodos = ko.computed(function () {
            switch (self.showMode()) {
                case 'active':
                    return self.todos().filter(function (todo) {
                        return !todo.completed();
                    });
                case 'completed':
                    return self.todos().filter(function (todo) {
                        return todo.completed();
                    });
                default:
                    return self.todos();
            }
        });

        // count of all completed todos
        self.completedCount = ko.computed(function () {
            return self.todos.filter(function (todo) {
                return todo.completed();
            }).length;
        });

        // count of todos that are not complete
        self.remainingCount = ko.computed(function () {
            return self.todos().length - self.completedCount();
        });

        // writeable computed observable to handle marking all complete/incomplete
        self.allCompleted = ko.computed({
            //always return true/false based on the done flag of all todos
            read: function () { return !self.remainingCount();},
            // set all todos to the written value (true/false)
            write: function (newValue) {
                ko.utils.arrayForEach(self.todos(), function (todo) {
                    // set even if value is the same, as subscribers are not notified in that case
                    todo.completed(newValue);
                });
            }
        });


        // Methods
        // ------------------------------------------

        ko.computed(function () {
            todoStorage.set(ko.toJS(self.todos));
        }).extend({throttle: 500}); // save at most twice per second




    }
});

todomvc.run(function(TodoVM,todoStorage, $bind){
    var todos = todoStorage.get();
    var viewModel = new TodoVM({todos: todos});

    $bind(viewModel,document.getElementById("#view"));
});