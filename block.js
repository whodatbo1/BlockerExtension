/**
 * Gets the current tab
 * @returns tab
 */
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

/**
 * The list of keywords that should be blocked
 */
var keywords = []

/**
 * For each keyword, check whether it's contained in the tab URL.
 * If it is, close the tab.
 */
function deleteTabIfContainsKeyword() {
    getCurrentTab()
        .then((tab) => {
            keywords.forEach((site) => {
                if(String(tab.url).includes(site)){
                    chrome.tabs.remove(tab.id);
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
} 

/**
 * If there exists a blocked_sites instance in local store, load it.
 * Otherwise put an empty array in the store.
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("blocked_sites", ({ blocked_sites }) => {
        if (blocked_sites === undefined){
            chrome.storage.local.set({ blocked_sites: keywords });
        } else {
            keywords = blocked_sites;
        }
    });
});

/**
 * When the local store changes, we load up the list of blocked sites again.
 */
chrome.storage.local.onChanged.addListener(() => {
    chrome.storage.local.get("blocked_sites", ({ blocked_sites }) => {
        keywords = blocked_sites;
    });
})

/**
 * Everytime a new tab is loaded, we check whether we should remove it.
 */
chrome.runtime.onInstalled.addListener(() => {
    console.log(keywords);
    deleteTabIfContainsKeyword();
});

chrome.tabs.onActivated.addListener(() => {
    console.log(keywords);
    deleteTabIfContainsKeyword();
});

chrome.tabs.onUpdated.addListener(() => {
    console.log(keywords);
    deleteTabIfContainsKeyword();
});
