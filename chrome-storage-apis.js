const setChromeStorage = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(key, () =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve()
        )
    )

const getChromeStorage = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    )

const removeChromeStorage = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.remove(key, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );

const getlocalStorage = (data) => {
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
const setlocalStorage = (data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, (response) => {
            console.log(response);
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(response);
            }
        });
    });
};