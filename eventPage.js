





function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    if (domain.indexOf("www.") == 0){ domain=domain.slice(4);}
    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}




chrome.browserAction.onClicked.addListener(function(tab) {
    var url = tab.url;
    var id = tab.id.toString();
    chrome.storage.local.get(id, function(items){
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
//     console.log("current domain is "+curr_domain);
//     chrome.tabs.query({currentWindow: true, active: false, pinned: false}, function(tabs){
//         for (var i = 0; i < tabs.length; i++) {
//             if (extractDomain(tabs[i].url)==curr_domain){
//                 // url=tabs[i].url;
//                 chrome.tabs.remove(tabs[i].id,function(i)
//                     {
//                         return function()
//                         {
//                             console.log(tabs[i].url+" closed...");
//                         };
//                     }(i)
//                 );
//             }
//         }
//     });
// });

chrome.tabs.onCreated.addListener(function(tab){
    var tabstring = JSON.stringify(tab, null, 2);
    var id=tab.id.toString();
    // console.log(tabstring);
    var parent_id=tab["openerTabId"];
    if(parent_id){
        // console.log(id);
        //get parent tab
        chrome.tabs.get(parent_id, function(parent_tab){
            var url=parent_tab.url;
            //get old value
            storage=chrome.storage.local.get(function(data){
                // console.log(JSON.stringify(data)+typeof(data));
                // add new value
                data[id]={'parent_id':parent_id,'parent_url':url};
                //set to storage
                chrome.storage.local.set(data, function() {
                    // Notify that we saved.
                    console.log('Settings saved');
                });
                
            });

        });
    }
});