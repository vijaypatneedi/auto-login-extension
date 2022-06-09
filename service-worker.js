// service worker script(background script)
console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files.
importScripts('service-worker-utils.js')
importScripts('chrome-storage-apis.js')


async function startProcess() {
    let loginData = await getStorageData('loginData');
    console.log('loginData is...', loginData);
    if (Object.keys(loginData).length && loginData.loginData.autoLogin) {
        createOrSelectTab()
    }

}
startProcess()

// setInterval(() => { console.log('hello backgroundjs') }, 2000);