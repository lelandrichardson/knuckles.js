
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
    return str.replace(/\//gi,''); //TODO: ensure this removes only first and last char slashes
};

// note: should we be using ko.toJSON here first?
/**
 * Consumes an object hash only one level deep) and serializes into
 * @param obj
 * @returns {string}
 */
var objectUrlEncode = function(obj){
    var pairs = [];
    each(obj,function(k,v){
        pairs.push(''+k+'='+v);
    });
    return pairs.join('&');
};



//TODO: look into adding a way to redefine extender defaults globally...

//TODO: look up that REST API best practices article...
// http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api?hn
Knuckles.extender.define({
    name: 'rest',
    deps: ['$http'],
    defaults: {
        urlPrefix: "/",
        idKey: "id",


        envelope: null, // property to find core result (e.g. "data")... null by default?



        // paging conventions
        // should handle "next" and "prev" urls (ie, cursors) // this means the "Link" header will have a rel="next" and rel="last"
        // OR
        // should handle "pageNumber", "perPage"
        // OR
        // should handle "start", "end"

        // paging: "next-prev",
        // paging: "numbered",
        // paging: "start-end",



        // errors being handled with status codes or a status field???
        // statusProp: "responseStatus", // property to find the status of the response

        // whether or not to URL encode or JSON encode...


    },
    fn: function(cfg, $http){
        var resource = cfg.resource;

        if(!isString(resource)){
            $fail("Must supply a resource name to the 'rest' extender");
        }

        //retrieves the corresponding "entity" data from a response body...
        function getEntity(response){
            if(cfg.envelope){
                return response[cfg.envelope];
            }
            if(cfg.jsonp){
                //TODO:
            }
            return response;
        }

        //utility method to construct restful urls
        /**
         *
         * @param method
         * @param self
         * @param related
         * @returns {Array}
         */
        function constructUrl(method, self, related){
            var pathParts = [cfg.urlPrefix,cfg.resource],
                queryParts = {},
                urlParts = [];

            switch(method){
                case "get": // {root-url}/{resource-name}/{id}
                case "post":
                case "delete":
                    pathParts.push(unwrap(self[cfg.idKey]));
                    break;
                case "put": // {root-url}/{resource-name}
                    pathParts.push(unwrap(self[cfg.idKey]));
                    break;
            }

            if(isDefined(related)){

                if(isString(related)){
                    // simple list method
                }

            }

            urlParts.push(map(pathParts,removeSlashes).split('/'));

            if(!isEmptyObject(queryParts)){
                urlParts.push('?',objectUrlEncode(queryParts));
            }

            return urlParts.split('');
        }

        return {
            load: function(success, error){
                var self = this;
                return $http.get({url: constructUrl("get",self)})
                    .done(function(data){
                        self.$populate(getEntity(data));
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            create: function(success, error){
                var self = this;
                return $http.put({url: constructUrl("put",self)})
                    .done(function(data){
                        self.$populate(getEntity(data));
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            save: function(success, error){
                var self = this;
                return $http.post({url: constructUrl("post",self)})
                    .done(function(data){
                        self.$populate(getEntity(data));
                    })
                    .done(success || noop)
                    .fail(error || noop);
            },
            delete: function(success, error){
                var self = this;
                return $http.delete({url: constructUrl("delete",self)})
                    .done(success || noop)
                    .fail(error || noop);
            }
        }

    }
});