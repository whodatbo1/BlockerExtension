let bs = ["kmp"];

function setBS(blocked_sites){
    bs = blocked_sites
}

function getBlockedSites() {
    str = bs.reduce((acc, curr) => acc + "  ||  " + curr, "");
    return str;
}

function blockSite(site) {
    if(!bs.includes(site)){
        bs.push(site);
    }
}

function onClickBlock(){
    blockSite(document.getElementById("add_site").value);
    document.getElementById("blocked").innerHTML = getBlockedSites();
}

function setup(){
    document.getElementById("blocked").innerHTML = getBlockedSites();
    document.getElementById("block").onclick = onClickBlock;
}

function getStorageInfo(saveBS){
    chrome.storage.local.get("blocked_sites", ({blocked_sites}) => {
        saveBS(blocked_sites);
    });
}

getStorageInfo((blocked_sites) => setBS(blocked_sites));

document.addEventListener("DOMContentLoaded", setup(), false);
document.addEventListener("update", setup(), false);