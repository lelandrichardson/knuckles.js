function waitsForPromise(promise){
    waitsFor.call(this,function(){
        return promise.state() == "resolved";
    });
    return promise;
}