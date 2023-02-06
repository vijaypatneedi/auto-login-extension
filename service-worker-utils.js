// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

console.log("External file is also loaded!")

const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const createOrSelectTab = (url2) => {
    const matchUrls = ["https://vms.axisb.com:8443/login", "https://vms.axisb.com:8443/"];
    return new Promise((resolve, reject) => {
        try {
            let currentTab;
            chrome.tabs.query({ url: matchUrls }, async(tabs) => {
                if (tabs.length > 0) {
                  console.log(`Matched tabs with URL(s): ${matchUrls.join(", ")}`);

                  const filteredTab1 = tabs.filter(tab => tab.url === "https://vms.axisb.com:8443/")[0];
                  const filteredTab2 = tabs.filter(tab => tab.url === "https://vms.axisb.com:8443/login")[0];
                    if (filteredTab1) currentTab = filteredTab1;
                    else if (filteredTab2) currentTab = filteredTab2;

                } else {
                  console.log(`No tabs with URL(s): ${matchUrls.join(", ")} were found`);
                  currentTab = await createTab(matchUrls[0]);
                }
                resolve(currentTab.id);
                console.log("Website Tab opened, id : ", currentTab.id);
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
// Helper function to pause control/flow untill specified selector is available
const waitForElement = (selector) => {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                console.log('element found')
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
};
