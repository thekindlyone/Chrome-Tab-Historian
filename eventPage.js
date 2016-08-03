





chrome.browserAction.onClicked.addListener(function(tab) {
    var url = tab.url;
    var id = tab.id.toString();
    chrome.storage.local.get(id, function(items){
        console.log(JSON.stringify(items));
        if(!chrome.runtime.lastError){
            parent_id=items[id].parent_id;
            parent_url=items[id].parent_url;
            chrome.tabs.get(parent_id,function(tab){
                if (!chrome.runtime.lastError){
                    if(parent_url==tab.url){
                        chrome.tabs.update(parent_id, {selected: true});
                    }
                    else{
                        chrome.tabs.create({'url':parent_url,'selected':true}, function(atab){console.log('tab created');});
                    }
                }
                else{
                    chrome.tabs.create({'url':parent_url,'selected':true}, function(atab){console.log('tab created_2');});                    
                }
            });

            // console.log(JSON.stringify(items[id].parent_tab));
        }

    });   
});


chrome.tabs.onCreated.addListener(function(tab){
    var tabstring = JSON.stringify(tab, null, 2);
    var id=tab.id.toString();
    var parent_id=tab["openerTabId"];
    if(parent_id){
        //get parent tab
        chrome.tabs.get(parent_id, function(parent_tab){
            var url=parent_tab.url;
            //get old value
            var data={};
            data[id]={'parent_id':parent_id,'parent_url':url};
            // console.log(JSON.stringify(data));
            // chrome.storage.local.getBytesInUse()
            chrome.storage.local.set(data, function() {
                // Notify that we saved.
                console.log('Settings saved');
            });
        });
    }
});


chrome.tabs.onRemoved.addListener(function(id,info){
    var id=id.toString();
    chrome.storage.local.remove(id, function(){
        if(chrome.runtime.lastError){
            console.log('not found');
        }
        else{
            console.log('deleted');
        }
    });
});