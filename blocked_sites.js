/**
 * Adds a keyword to the blocked list
 * @param {*} site string
 */
function addSite(site) {
    performAction(performActionCallback, function(blocked_sites){
        if(!blocked_sites.includes(site)){
            blocked_sites.push(site);
        }
        console.log("Added site:", String(site))
        updateStorage(blocked_sites);
    });
}

/**
 * To be used for setting up the onClick events of the remove buttons.
 * @param {*} site a string representing a keyword to be removed from the blocked list
 * @returns A function which removes a particular word from the keyword list
 */
function removeSite(site){
    performAction(performActionCallback, function(blocked_sites){
        blocked_sites = blocked_sites.filter((blocked_site) => {
            return blocked_site != site;
        });
        console.log("Removed site:", String(site))
        updateStorage(blocked_sites);
    });
}

function removeOnClick(site){
    return function() {
        removeSite(site);
    }
}

function onClickBlock(){
    addSite(document.getElementById("add_site").value);
}

/**
 * Initial setup of the popup.
 * Adds the onClick and keydown events to the elements.
 */
function setup(){
    document.getElementById("block").onclick = onClickBlock;
    document.getElementById("add_site").addEventListener("keydown", (e) => {
        if(e.code=="Enter"){
            onClickBlock()
        }
    });
}

function updateStorage(blocked_sites){
    let list = document.getElementById("blocked_list")
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    blocked_sites.forEach((curr) => {
        console.log(curr);
        let element = document.getElementById(String(curr))
        let button = document.createElement("button");
        button.innerHTML = curr;
        button.id = curr;
        button.onclick = removeOnClick(curr);
        document.getElementById("blocked_list").appendChild(button);
    });
    chrome.storage.local.set({ blocked_sites: blocked_sites });
}

function performAction(performActionCallback, actionCallback){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        keywords = blocked_sites;
        performActionCallback(blocked_sites, actionCallback);
    });
}

function performActionCallback(blocked_sites, actionCallback){
    actionCallback(blocked_sites);
}

performAction(performActionCallback, updateStorage);

document.addEventListener("DOMContentLoaded", setup(), false);
