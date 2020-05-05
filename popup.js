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


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("ptGoAmazon").addEventListener("click", function (element) {
        setStorageLocal('open_amazon', 1).then(function () {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab = tabs[0];
                chrome.tabs.update(tab.id, {url: "https://www.amazon.com.tr"});
            });
        });
    });
});
