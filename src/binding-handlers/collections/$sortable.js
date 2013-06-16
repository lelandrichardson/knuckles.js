//sortableList (requires jquery-ui)
if($.fn.sortable){
    bindingHandlers.sortableList = {
        init: function (element, valueAccessor) {
            var list = valueAccessor();
            var oldPosition = -1;
            $(element).sortable({
                start: function (event, ui) {
                    //save the initial position for object retrieval later
                    oldPosition = ui.item.index();
                },
                update: function (event, ui) {
                    //retrieve our actual data item
                    //note what this old code returned was not the object we wanted.
                    //var item = ui.item.tmplItem().data;
                    var item = list()[oldPosition];
                    //figure out its new position
                    var position = ui.item.index();//ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
                    //remove the item and add it back in the right spot
                    if (position >= 0) {
                        list.remove(item);
                        list.splice(position, 0, item);
                    }
                    ui.item.remove();
                }//,
                //note this was just for debugging. Hard to inspect an element while also dragging
                //change: function (event, ui) {
                //}
            });
        }
    };
}