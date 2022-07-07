chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "vmsProcess") {
        console.log('vms alarm called')
        startVmsProcess();
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('vmsProcess', a => {
        if (!a) {
            console.log('vms alarm created')
            chrome.alarms.create('vmsProcess', {
                periodInMinutes: 1
            });
        }
    });
});

chrome.runtime.onInstalled.addListener(async () => {
    await setChromeStorage({ checkInTime: '' })
    await setChromeStorage({ checkOutTime: '' })
    await setChromeStorage({ todaysDate: '' })
});

// service worker script(background script)
console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files.
importScripts('service-worker-utils.js')
importScripts('chrome-storage-apis.js')




async function startVmsProcess() {

    let today = new Date();
    let savedDate = await getChromeStorage('todaysDate');
    console.log('savedDate/todayDate is...', savedDate.todaysDate, today.getDate().toString());
    if (today.getDate().toString() !== savedDate.todaysDate) {
        await setChromeStorage({ todaysDate: today.getDate().toString() })
        await setChromeStorage({ checkInTime: '' })
        await setChromeStorage({ checkOutTime: '' })
    }

    let loginData = await getChromeStorage('loginData');
    console.log('loginData is...', loginData);
    if (Object.keys(loginData).length && loginData.loginData.autoLogin) {
        let checkInTime = await getChromeStorage('checkInTime');
        let checkOutTime = await getChromeStorage('checkOutTime');
        console.log('checkInTime/checkOutTime is...', checkInTime, checkOutTime);
        if (!checkInTime.checkInTime) {
            console.log('checkIn called');
            createOrSelectTab()
        }
        if (checkInTime.checkInTime && !checkOutTime.checkOutTime) {
            console.log('checkout logic to be implemented');
            let checkin = 'In-Time: 04:47'//checkInTime.checkInTime
            let time = checkin.split(":")
            console.log(time)
            let checkinTime = new Date()
            checkinTime.setHours(time[1])
            checkinTime.setMinutes(time[2])
            console.log(checkinTime)
            let checkoutTime = new Date();
            console.log(checkoutTime)
            let hours = Math.abs(checkoutTime - checkinTime) / 36e5;
            console.log(hours)
        }

    }

}

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