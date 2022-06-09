// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

console.log("External file is also loaded!")

const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getlocalStorageValue = (data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(data, function (response) {
            console.log(response);
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(response);
            }
        });
    });
};
const createOrSelectTab = (url2) => {
    let url = "https://vms.axisb.com:8443/"
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({ url: url }, async (site) => {
                if (site.length > 0)
                    site = await updateTab(
                        site[0].id,
                        url
                    );
                else site = await createTab(url);

                // Update site tab to login page
                let siteTab = await updateTab(
                    site.id,
                    url
                );
                let siteTabId = siteTab.id;
                console.log("Website Tab opened, id : ", siteTabId);
                resolve(siteTabId);
            });
        } catch (e) {
            reject(`Error : ${e.message}`);
        }
    });
};
const createTab = (tabUrl) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.create({ url: tabUrl, active: false }, (tab) => resolve(tab));
        } catch (e) {
            reject(`Error : ${e.message}`);
        }
    });
};
const updateTab = (tabId, tabUrl) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.update(tabId, { url: tabUrl, active: false }, (tab) =>
                resolve(tab)
            );
        } catch (e) {
            reject(`Error : ${e.message}`);
        }
    });
};
