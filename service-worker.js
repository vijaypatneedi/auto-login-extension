// service worker script(background script)
console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files.
importScripts('service-worker-utils.js')
importScripts('chrome-storage-apis.js')


async function startProcess() {
    let loginData = await getChromeStorage('loginData');
    console.log('loginData is...', loginData);
    if (Object.keys(loginData).length && loginData.loginData.autoLogin) {
        createOrSelectTab()
    }

}
startProcess()

// PORT FOR COMMUNICATION WITH CONTENT SCRIPT
chrome.runtime.onConnect.addListener(async (port) => {
    port.onMessage.addListener(async ({ type, params }) => {
        switch (type) {
            case "vmsConnection":
                console.log("CONNECTION ESTABLISHED WITH VMS--PORT OPENED BY CONTENT SCRIPT");
                //If not yet logged in then, send this message
                port.postMessage({
                    type: "startVmsLogin",
                    params: null,
                });
                break;

            case "loginStatus":
                console.log("LOGIN STATUS SENT BY CONTENT SCRIPT");
                if (params.login) {
                    port.postMessage({
                        type: "markAttendance",
                        params: null,
                    });
                }
                break;
            case "arcosConnection":
                console.log("CONNECTION ESTABLISHED WITH ARCOS--PORT OPENED BY CONTENT SCRIPT");
                //If not yet logged in then, send this message
                port.postMessage({
                    type: "startArcosLogin",
                    params: null,
                });
                break;
            case "arcosLoginStatus":
                console.log("LOGIN STATUS SENT BY AROCS CONTENT SCRIPT");
                if (params.login) {
                    console.log('logged status reached service worker')
                }
                break;

            default:
                console.log("hhhh");
        }
    });
});