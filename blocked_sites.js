var bs = [];

function setBS(blocked_sites){
    bs = blocked_sites
}

function getBlockedSites() {
    str = bs.reduce((acc, curr) => {
        return(acc + "  ||  " + curr);
    }, "");
    return str;
}

function blockSite(site) {
    if(!bs.includes(site)){
        bs.push(site);
    }
}

function removeSite(site){
    return function(){
        bs = bs.filter((blocked_site) => {
            return blocked_site != site;
        });
        update();
    }
}

function onClickBlock(){
    blockSite(document.getElementById("add_site").value);
    update();
}

function setup(){
    document.getElementById("block").onclick = onClickBlock;
    document.getElementById("add_site").addEventListener("keydown", (e) => {
        if(e.code=="Enter"){
            onClickBlock()
        }
    });
}

function updateStorage(){
    chrome.storage.local.set({ blocked_sites: bs });
}

function update(){
    let list = document.getElementById("blocked_list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    str = bs.forEach((curr) => {
        let but = document.createElement("button");
        but.innerHTML = curr;
        but.id = curr;
        but.onclick = removeSite(curr);
        document.getElementById("blocked_list").appendChild(but);
    });
    updateStorage();
}

function getStorageInfo(saveBS){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        saveBS(blocked_sites);
    });
}

getStorageInfo((blocked_sites) => {
    setBS(blocked_sites);
    update();
});

document.addEventListener("DOMContentLoaded", setup(), false);
document.addEventListener("update", update(), false);