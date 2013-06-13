var restify = function(Ctor, resource, config){

    var serialize = config.serialize || ko.toJS;
    var deserialize = config.deserialize || ko.fromJS;

    extend(Ctor,{
        get: function(id, callback){
            //create new viewModel
            var model = new Ctor();
            GET({
                url: '/' + resource + '/' + id,
                success: function(data){
                    //load data into viewModel
                    deserialize(model,data);
                    //callback with newly instantiated viewModel
                    callback && callback(model);
                }
            });
            return model;
        },
        create: function(callback){
            //create new viewModel
            var model = new Ctor();
            PUT({
                url: '/' + resource,
                success: function(data){
                    //load data into viewModel
                    deserialize(model,data);
                    //callback with newly instantiated viewModel
                    callback && callback(model);
                }
            });
            return model;
        },
        update: function($instance, callback){
            POST({
                url: '/' + resource,
                data: serialize($instance),
                success: function(data){
                    //load data into viewModel
                    deserialize($instance,data);
                    //callback with newly instantiated viewModel
                    callback && callback(data);
                }
            });
        },
        remove: function(id, callback){
            DELETE({
                url: '/' + resource + '/' + id,
                success: function(data){
                    //callback with response
                    callback && callback(data);
                }
            });
        }
    });


    extend(Ctor.prototype,{
        load: function(success, error){
            var self = this;
            GET({
                url: '/' + resource + '/' + unwrap(self.id),
                success: function(data){
                    //load data into viewModel
                    deserialize(self,data);
                    //callback with newly instantiated viewModel
                    success && success(data);
                },
                error: error
            });
        },
        create: function(success, error){
            var self = this;
            PUT({
                url: '/' + resource,
                success: function(data){
                    //load data into viewModel
                    deserialize(self,data);
                    //callback with newly instantiated viewModel
                    success && success(data);
                },
                error: error
            });
        },
        save: function(success, error){
            var self = this;
            POST({
                url: '/' + resource + '/' + unwrap(self.id),
                success: function(data){
                    //load data into viewModel
                    deserialize(self,data);
                    //callback with newly instantiated viewModel
                    success && success(data);
                },
                error: error
            });
        },
        delete: function(success, error){
            var self = this;
            DELETE({
                url: '/' + resource + '/' + unwrap(self.id),
                success: success,
                error: error
            });
        }
    });

    return Ctor;
};

//Knuckles.viewModel.define({
//    name: 'Cocktail',
//    deps: [],
//    extenders: {
//        'restify': true,
//        'restify2': {
//            resource: 'cocktail'
//        }
//    }
//});

var removeSlashes = function(str){
    return str.replace(/\//gi,'');
};
var constructUrl = function(cfg, self){
    //TODO: make smarter...
    return map([cfg.urlPrefix,cfg.resource,unwrap(self.id)],removeSlashes).split('/');
};

Knuckles.extender.define({
    name: 'restify',
    deps: ['$http'],
    defaults: {
        urlPrefix: "/",
        idKey: "id"
    },
    fn: function(cfg,$http){

        return {
            load: function(success, error){
                var self = this;
                return $http.get({url: '/' + resource + '/' + unwrap(self.id)})
                    .done(function(data){
                        self.$deserialize(data);
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            create: function(success, error){
                var self = this;
                return $http.put({url: '/' + resource})
                    .done(function(data){
                        self.$deserialize(data);
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            save: function(success, error){
                var self = this;
                return $http.post({url: '/' + resource + '/' + unwrap(self.id)})
                    .done(function(data){
                        self.$deserialize(data);
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            delete: function(success, error){
                var self = this;
                return $http.delete({ url: '/' + resource + '/' + unwrap(self.id)})
                    .done(success || noop)
                    .fail(error || noop);
            }
        }

    }
})