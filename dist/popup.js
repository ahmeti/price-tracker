let ptGoAmazon = document.getElementById('ptGoAmazon');


function setStorageLocal(key, value)
{
    return new Promise(function(resolve, reject){

        let setItem = {};
        setItem[key] = value;

        chrome.storage.local.set(setItem, function() {
            resolve(value);
        });
    })
}

ptGoAmazon.onclick = function(element) {
    setStorageLocal('open_amazon', 1).then(function () {

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            chrome.tabs.update(tab.id, {url: "https://www.amazon.com.tr"});


            /*chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'document.location.href = "https://www.amazon.com.tr";'
                });*/
        });
    });

};