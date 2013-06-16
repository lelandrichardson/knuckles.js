!function(factory) {
    if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports','knockout','jquery'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['Knuckles'] = {},window['ko'],window['jQuery']);
    }
}(function(Knuckles,ko,$){
