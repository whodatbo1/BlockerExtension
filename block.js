async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

blocked_sites = ["TheSyntesizeR", "synapse"]

function getBlockedSites() {
    return blocked_sites;
}

function blockSite(site) {
    blocked_sites.add(site);
}

function deleteTabIfBad() {
    getCurrentTab()
        .then((tab) => {
            blocked_sites.forEach((site) => {
                if(String(tab.url).includes(site)){
                    chrome.tabs.remove(tab.id);
                }
            });
        })
        .catch((err) => {
            console.log("Some error occured ");
            console.error(err);
        });
} 

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ blocked_sites: blocked_sites });
    console.log("Added some shit I guess");
  });

chrome.runtime.onInstalled.addListener(() => {
    deleteTabIfBad();
});

chrome.tabs.onActivated.addListener(() => {
    deleteTabIfBad();
});

chrome.tabs.onUpdated.addListener(() => {
    deleteTabIfBad();
});
