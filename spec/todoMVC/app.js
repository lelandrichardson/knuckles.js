
// APP DECLARATION
// --------------------------------------------------------

var todomvc = Knuckles.module('todomvc',[]);

// MODULE SERVICES
// ------------------------------------------------------------
todomvc.service({
    name: 'todoStorage',
    deps: ['$localStorage'],
    factory: function ($localStorage) {
        var STORAGE_ID = 'todos-knuckles';

        return {
            get: function () {
                return JSON.parse($localStorage.getItem(STORAGE_ID) || '[]');
            },

            put: function (todos) {
                $localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
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
    }
});



todomvc.viewModel({
    name: 'TodoVM',
    deps: ['TodoItem','$http', 'todoStorage'],
    factory: function(spec, TodoItem, $http, todoStorage){
        var self = this;
        self.current = ko.observable();

        self.newTodo = ko.observable();
        self.editedTodo = null;

        self.showMode = ko.observable('all');




        // To Do Collection
        // ------------------------------------------
        self.todos = ko.observableArray().ofType(TodoItem);


        self.$populate(spec);
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
            return self.todos().filter(function (todo) {
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
                Knuckles.each(self.todos(), function (todo) {
                    // set even if value is the same, as subscribers are not notified in that case
                    todo.completed(newValue);
                });
            }
        });


        // Methods
        // ------------------------------------------

        self.getLabel = function (count) {
            return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
        };



        ko.computed(function () {
            todoStorage.put(ko.toJS(self.todos));
        }).extend({throttle: 500}); // save at most twice per second




        Knuckles.extend(self,{
            add: function(){
                var current = this.current().trim();
                if (current) {
                    self.todos.push({title: current});
                    self.current('');
                }
            },
            remove: function (todo) {
                self.todos.remove(todo);
            },
            removeCompleted: function () {
                self.todos.remove(function (todo) {
                    return todo.completed();
                });
            }
        });


    }
});

todomvc.run(['TodoVM','todoStorage','$bind'],
    function(TodoVM,todoStorage, $bind){
        var todos = todoStorage.get();
        var viewModel = new TodoVM({todos: todos});

        $bind(viewModel);
    });