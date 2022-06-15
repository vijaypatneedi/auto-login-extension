//IMPORTS
const getChromeStorage = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    )

const setChromeStorage = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(key, () =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve()
        )
    )
const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const waitForElement = (selector) => {
    console.log('wait for element called', selector, selector.toString())
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                console.log('element found')
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
            else {
                console.log('observer  disconnected');
                observer.disconnect();
            }
        });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    });
};

let port = chrome.runtime.connect({ name: "arcos" });


// OPEN PORT FROM VMS PAGE TO CONNECT WITH SERVICE WORKER
const initPort = async () => {
    port.postMessage({
        type: "arcosConnection",
        params: null,
    });

};

initPort();


// PORT COMMUNICATION CODE
port.onMessage.addListener(async ({ type, data }) => {
    switch (type) {
        case "startArcosLogin":
            console.log("ARCOS LOGIN REQUESTED BY SERVICE WORKER");
            await tryArcosLogin();
            port.postMessage({
                type: "arcosLoginStatus",
                params: { login: true },
            });
            break;
        case "messageReceived":
            console.log('acknowledgement received')
            break;

        case "markAttendance":
            console.log("MARK ATTENDANCE REQUESTED BY SERVICE WORKER");
            await markAttendance();
            port.postMessage({ type: "attendanceMarked", params: data });
            break;

        default:
            console.log("hhhh");
    }

});

//HELPER FUNCTION TO COMMUNICATE WITH SERVICE-WORKER, WHEN URL UPDATES
const action = async () => {
    switch (window.location.href) {

        case "https://vms.axisb.com:8443/":
            port.postMessage({
                type: "loginStatus",
                params: { login: true },
            });
            break;

        case "https://vms.axisb.com:8443/login":
            port.postMessage({
                type: "loginStatus",
                params: { login: false },
            });
            break;

        default:
            break;
    }
};
action();


const tryArcosLogin = async () => {

    let loginData = {};

    let eve = new Event('input', { bubbles: true, cancelable: false });

    const userId = document.getElementById('txtusername');
    const password = document.getElementById('txtpassword');

    loginData = await getChromeStorage('loginData');
    await document.getElementById('ctl00_objUCInfoDetails_btnOk').click()

    if (Object.keys(loginData).length !== 0) {
        userId.value = loginData.loginData.userId.toString();
        password.value = loginData.loginData.password.toString();

        await userId.dispatchEvent(eve);
        await password.dispatchEvent(eve);
        // await document.getElementById('ctl00_MainContent_imgbtnLogin').click()

    }

}


