async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

var bs = ["TheSyntesizeR", "synapse"]

function deleteTabIfBad() {
    getCurrentTab()
        .then((tab) => {
            bs.forEach((site) => {
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
    chrome.storage.local.set({ blocked_sites: bs });
    console.log("Added some shit I guess");
});

chrome.storage.local.onChanged.addListener(() => {
    chrome.storage.local.get("blocked_sites", ({ blocked_sites }) => {
        console.log("changes");
        console.log(blocked_sites);
        bs = blocked_sites;
    });
})

chrome.runtime.onInstalled.addListener(() => {
    deleteTabIfBad();
});

chrome.tabs.onActivated.addListener(() => {
    deleteTabIfBad();
});

chrome.tabs.onUpdated.addListener(() => {
    deleteTabIfBad();
});
