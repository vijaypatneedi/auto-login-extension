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

let port = chrome.runtime.connect({ name: "vms" });


// OPEN PORT FROM VMS PAGE TO CONNECT WITH SERVICE WORKER
const initPort = async () => {
    port.postMessage({
        type: "vmsConnection",
        params: null,
    });

};

initPort();


// PORT COMMUNICATION CODE
port.onMessage.addListener(async ({ type, data }) => {
    switch (type) {
        case "startVmsLogin":
            console.log("LOGIN REQUESTED BY SERVICE WORKER");
            await tryVmsLogin();
            break;
        case "messageReceived":
            console.log('acknowledgement received')
            break;

        case "checkIn":
            console.log("CHECK-IN REQUESTED BY SERVICE WORKER");
            await checkIn();
            port.postMessage({ type: "attendanceMarked", params: data });
            break;
        case "checkOut":
            console.log("CHECK-OUT REQUESTED BY SERVICE WORKER");
            await checkOut();
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


const tryVmsLogin = async () => {

    let loginData = {};

    let eve = new Event('input', { bubbles: true, cancelable: false });

    const userId = document.getElementById('email');
    const password = document.getElementById('password');

    loginData = await getChromeStorage('loginData')

    if (Object.keys(loginData).length !== 0) {
        userId.value = loginData.loginData.userId.toString();
        password.value = loginData.loginData.password.toString();

        await userId.dispatchEvent(eve);
        await password.dispatchEvent(eve);
        await document.querySelector('button[type="submit"]').click()
    }
}

const checkIn = async () => {
    await document.querySelector('[class="fa fa-sign-in"]').parentElement.click();
    await document.querySelector('[type="button"][id="popup_ok"]').click();
    await timeout(1000);
    // await waitForElement('#popup_ok');
    await document.querySelector('[type="button"][id="popup_ok"]').click();
    let checkInTime = await document.getElementById('punchIn').innerHTML;
    await setChromeStorage({ checkInTime: checkInTime });
}

const checkOut = async () => {
    await document.querySelector('[class="fa fa-sign-out"]').parentElement.click();
    await document.querySelector('[type="button"][id="popup_ok"]').click();
    await timeout(1000);
    // await waitForElement('#popup_ok');
    await document.querySelector('[type="button"][id="popup_ok"]').click();
    let checkInTime = await document.getElementById('punchIn').innerHTML;
    await setChromeStorage({ checkInTime: checkInTime });
}
