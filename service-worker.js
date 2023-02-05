chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "vmsProcess") {
        console.log('************vms alarm API called**************')
        startVmsProcess();
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('vmsProcess', a => {
        if (!a) {
            console.log('vms alarm created')
            chrome.alarms.create('vmsProcess', {
                periodInMinutes: 15
            });
        }
    });
});

chrome.runtime.onInstalled.addListener(async () => {
    await setChromeStorage({ checkInTime: '' })
    await setChromeStorage({ checkOutTime: '' })
    await setChromeStorage({ todaysDate: '' })
    await setChromeStorage({ loginAttempts: 0 })
});

// service worker script(background script)
console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files.
importScripts('service-worker-utils.js')
importScripts('chrome-storage-apis.js')




async function startVmsProcess() {

     // Check if the day is a weekend
     let today = new Date();
     let dayOfWeek = today.getDay();
     let loginAttempts = await getChromeStorage('loginAttempts');
     console.log('loginAttempts', loginAttempts);
     if (dayOfWeek === 0 || dayOfWeek === 6 || loginAttempts.loginAttempts> 3) {
         console.log("Today is a weekend or password has expired, not running the process");
         return;
     }

    let savedDate = await getChromeStorage('todaysDate');
    console.log('savedDate in chrome storage is... ', savedDate.todaysDate, ' Todays date is... ', today.getDate().toString());
    if (today.getDate().toString() !== savedDate.todaysDate) {
        await setChromeStorage({ todaysDate: today.getDate().toString() })
        await setChromeStorage({ checkInTime: '' })
        await setChromeStorage({ checkOutTime: '' })
        await setChromeStorage({ loginAttempts: 0 })
    }

    let loginData = await getChromeStorage('loginData');
    console.log('loginData is...', loginData);
    if (Object.keys(loginData).length && loginData.loginData.autoLogin) {
        let checkInTime = await getChromeStorage('checkInTime');
        let checkOutTime = await getChromeStorage('checkOutTime');
        console.log('checkInTime is ...', checkInTime, 'checkOutTime is ...', checkOutTime);
        let checkin = checkInTime.checkInTime
        let time = checkin.split(":")
        let checkinTime = new Date()
        checkinTime.setHours(time[1])
        checkinTime.setMinutes(time[2])
        let checkoutTime = new Date();
        let hours = Math.abs(checkoutTime - checkinTime) / 36e5;
        if (!checkInTime.checkInTime || hours > 8) {
            console.log('Open VMS called');
            createOrSelectTab()
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
        let checkInTime = await getChromeStorage('checkInTime');
        let loginAttempts = await getChromeStorage('loginAttempts');
        let loginData = await getChromeStorage('loginData');
        switch (type) {
            case "vmsConnection":
                console.log("CONNECTION ESTABLISHED WITH VMS--PORT OPENED BY CONTENT SCRIPT");
                console.log('loginAttempts', loginAttempts.loginAttempts);
                if (!checkInTime.checkInTime && loginAttempts.loginAttempts<3 && loginData.loginData.autoLogin) {
                    port.postMessage({
                        type: "startVmsLogin",
                        params: null,
                    });
                }
                break;
            case "loginStatus":
                console.log("LOGIN STATUS SENT BY CONTENT SCRIPT");
                if (params.login) {
                    if (!checkInTime.checkInTime) {
                        port.postMessage({
                            type: "checkIn",
                            params: null,
                        });
                        await timeout(3000);
                        await notification();
                    }
                    else {
                        let checkin = checkInTime.checkInTime
                        let time = checkin.split(":")
                        let checkinTime = new Date()
                        checkinTime.setHours(time[1])
                        checkinTime.setMinutes(time[2])
                        let checkoutTime = new Date();
                        let hours = Math.abs(checkoutTime - checkinTime) / 36e5;
                        if (hours > 8 && hours <10) {
                            console.log('checkOut called');
                            port.postMessage({
                                type: "checkOut",
                                params: null,
                            });
                        }
                    }
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