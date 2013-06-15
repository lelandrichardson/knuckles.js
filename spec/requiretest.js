
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