/**
 * The list of keywords that should be blocked
 */
var keywords = [];

/**
 * Adds a keyword to the blocked list
 * @param {*} site string
 */
function blockSite(site) {
    if(!keywords.includes(site)){
        keywords.push(site);
    }
}

/**
 * To be used for setting up the onClick events of the remove buttons.
 * @param {*} site a string representing a keyword to be removed from the blocked list
 * @returns A function which removes a particular word from the keyword list
 */
function removeSite(site){
    return function(){
        keywords = keywords.filter((blocked_site) => {
            return blocked_site != site;
        });
        update();
    }
}

function onClickBlock(){
    blockSite(document.getElementById("add_site").value);
    update();
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

function updateStorage(){
    chrome.storage.local.set({ blocked_sites: keywords });
}

function update(){
    let list = document.getElementById("blocked_list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    str = keywords.forEach((curr) => {
        let but = document.createElement("button");
        but.innerHTML = curr;
        but.id = curr;
        but.onclick = removeSite(curr);
        document.getElementById("blocked_list").appendChild(but);
    });
    updateStorage();
}

function getStorageInfo(){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        keywords = blocked_sites;
        update()
    });
}

getStorageInfo();

document.addEventListener("DOMContentLoaded", setup(), false);