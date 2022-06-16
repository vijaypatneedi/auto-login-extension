// service worker script(background script)
console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files.
importScripts('service-worker-utils.js')
importScripts('chrome-storage-apis.js')


async function startProcess() {
    await setChromeStorage({ checkInTime: '' })
    await setChromeStorage({ checkOutTime: '' })
    let loginData = await getChromeStorage('loginData');
    console.log('loginData is...', loginData);
    if (Object.keys(loginData).length && loginData.loginData.autoLogin) {
        createOrSelectTab()
    }

}
startProcess()

const notification = async () => {
    console.log('notification called')
    let checkInTime = await getChromeStorage('checkInTime');
    console.log('checkInTime is...', checkInTime, `Your attendance was marked on ${checkInTime.checkInTime.toString()}`);

    chrome.notifications.create('NOTFICATION_ID', {
        type: 'basic',
        iconUrl: 'https://picsum.photos/200/300',
        title: 'Attendance Marked on VMS',
        message: ` ${checkInTime.checkInTime.toString()}`,
        priority: 2
    })
}


// PORT FOR COMMUNICATION WITH CONTENT SCRIPT
chrome.runtime.onConnect.addListener(async (port) => {
    port.onMessage.addListener(async ({ type, params }) => {
        switch (type) {
            case "vmsConnection":
                console.log("CONNECTION ESTABLISHED WITH VMS--PORT OPENED BY CONTENT SCRIPT");
                //If not yet logged in then, send this message
                let checkInTime = await getChromeStorage('checkInTime');
                if (!checkInTime.checkInTime) {
                    port.postMessage({
                        type: "startVmsLogin",
                        params: null,
                    });
                }
                break;
            case "loginStatus":
                console.log("LOGIN STATUS SENT BY CONTENT SCRIPT");
                if (params.login) {
                    port.postMessage({
                        type: "markAttendance",
                        params: null,
                    });
                }
                await timeout(3000);
                await notification();
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