

Knuckles.service.define({
    name: '$http',
    deps: [],
    factory: function(){

            var $http = function(cfg) {
                return $.ajax(extend(cfg, {
                    data: (cfg.dataType === 'json' && !cfg.processData) ? JSON.stringify(cfg.data) : cfg.data
                }));
            };
            return extend($http,{
                POST_OPTIONS: {
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    processData: false,
                    type: 'POST'
                },
                GET_OPTIONS: extend({},$http.POST_OPTIONS, { type: 'GET' }),
                PUT_OPTIONS:  extend({}, $http.POST_OPTIONS, { type: 'PUT' }),
                DELETE_OPTIONS: extend({}, $http.POST_OPTIONS, { type: 'DELETE' }),



                post: function (cfg) {
                    return $http(extend({}, $http.POST_OPTIONS, cfg));
                },
                get: function (cfg) {
                    return $http(extend({}, $http.GET_OPTIONS, cfg));
                },
                put: function (cfg) {
                    return $http(extend({}, $http.PUT_OPTIONS, cfg));
                },
                delete: function (cfg) {
                    return $http(extend({}, $http.DELETE_OPTIONS, cfg));
                }
            });
    }
});