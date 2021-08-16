/**
 * Adds a site to the blocked list
 * @param {*} site string
 */
function addSite(site) {
    performAction(performActionCallback, function(blocked_sites){
        if(!blocked_sites.includes(site)){
            blocked_sites.push(site);
        }
        updateStorage(blocked_sites);
    });
}

/**
 * Removes a site from the blocked list
 * @param {*} site string
 */
function removeSite(site){
    performAction(performActionCallback, function(blocked_sites){
        blocked_sites = blocked_sites.filter((blocked_site) => {
            return blocked_site != site;
        });
        updateStorage(blocked_sites);
    });
}

/**
 * Adds the URL of the currently active tab to the blocked list
 */
function blockCurrent(){
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions).then((tab) => {
        console.log(tab[0]);
        console.log(tab[0].url);
        if(tab[0].url){
            addSite(tab[0].url)
        };
    })
}

/**
 * Sets up the onClick events of the individual site buttons
 * @param {*} site string
 * @returns the onClick function
 */
function removeOnClick(site){
    return function() {
        removeSite(site);
    }
}

/**
 * The onClick function of the block button
 */
function onClickBlock(){
    addSite(document.getElementById("add_site").value);
}

/**
 * Initial setup of the popup.
 * Adds the onClick and keydown events to the elements.
 */
function setup(){
    document.getElementById("block").onclick = onClickBlock;
    document.getElementById("block_current").onclick = blockCurrent;
    document.getElementById("add_site").addEventListener("keydown", (e) => {
        if(e.code=="Enter"){
            onClickBlock()
        }
    });
}

/**
 * Updates the storage with the list of blocked sites
 * This also updates the visuals of the popup
 * @param {*} blocked_sites 
 */
function updateStorage(blocked_sites){
    let list = document.getElementById("blocked_list")
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    blocked_sites.forEach((curr) => {
        let button = document.createElement("button");
        button.innerHTML = curr;
        button.id = curr;
        button.onclick = removeOnClick(curr);
        document.getElementById("blocked_list").appendChild(button);
    });
    chrome.storage.local.set({ blocked_sites: blocked_sites });
}

/**
 * Fetches the value of blocked_sites from storage and performs an action
 * @param {*} performActionCallback The first callback should always be the performActionCallback as defined below
 * @param {*} actionCallback A function which takes an array of strings as arguments and performs an action
 */
function performAction(performActionCallback, actionCallback){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        keywords = blocked_sites;
        performActionCallback(blocked_sites, actionCallback);
    });
}
/**
 * To be used with performAction
 * @param {*} blocked_sites The list fetched from the storage
 * @param {*} actionCallback A function which takes an array of strings as arguments and performs an action
 */
function performActionCallback(blocked_sites, actionCallback){
    actionCallback(blocked_sites);
}

// Load up the popup visuals
performAction(performActionCallback, updateStorage);

document.addEventListener("DOMContentLoaded", setup(), false);
