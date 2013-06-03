define([
    "Knuckles",
    "jquery"
],function(kn,$){
    var extend = kn.extend,
        POST_OPTIONS = {
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            processData: false,
            type: 'POST'
        },
        GET_OPTIONS = extend(POST_OPTIONS,{type:'GET'}),
        PUT_OPTIONS = extend(POST_OPTIONS,{type:'PUT'}),
        DELETE_OPTIONS = extend(POST_OPTIONS,{type:'DELETE'}),
        $ajax = function(cfg) {
            return $.ajax(extend(cfg, {
                data: (cfg.dataType === 'json' && !cfg.processData) ? JSON.stringify(cfg.data) : cfg.data
            }));
        };
    $ajax.post = function(cfg){
        return $ajax(extend(POST_OPTIONS,cfg));
    };
    $ajax.get = function(cfg){
        return $ajax(extend(GET_OPTIONS,cfg));
    };
    $ajax.put = function(cfg){
        return $ajax(extend(PUT_OPTIONS,cfg));
    };
    $ajax.delete = function(cfg){
        return $ajax(extend(DELETE_OPTIONS,cfg));
    };
});