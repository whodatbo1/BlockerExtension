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
 * For each keyword, check whether it's contained in the tab URL.
 * If it is, close the tab.
 */
function deleteTabIfContainsKeyword(blocked_sites) {
    getCurrentTab()
        .then((tab) => {
            blocked_sites.forEach((site) => {
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
            chrome.storage.local.set({ blocked_sites: [] });
        }
    });
});

function performDelete(deleteTabIfContainsKeyword){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        console.log(blocked_sites);
        deleteTabIfContainsKeyword(blocked_sites);
    });
}

/**
 * Everytime a tab is loaded or updated, we check whether we should remove it.
 */
chrome.runtime.onInstalled.addListener(() => {
    performDelete(deleteTabIfContainsKeyword);
});

chrome.tabs.onActivated.addListener(() => {
    performDelete(deleteTabIfContainsKeyword);
});

chrome.tabs.onUpdated.addListener(() => {
    performDelete(deleteTabIfContainsKeyword);
});
