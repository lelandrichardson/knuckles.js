Knuckles.service.define({
    name: '$deferred',
    deps: [],
    factory: function(){
        $deferred.when = $when;
        return $deferred;
    }
});