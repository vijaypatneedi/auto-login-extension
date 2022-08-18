const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const tryLogin = async () => {

    console.log("LOGGED BY EXTENSION")

    let eve = new Event('input', { bubbles: true, cancelable: false });

    await timeout(2000);
    const corporateId = document.getElementsByClassName('MuiInputBase-input-86 MuiFilledInput-input-72')[0];
    const loginId = document.getElementsByClassName('MuiInputBase-input-86 MuiFilledInput-input-72')[1];
    const password = document.getElementsByClassName('MuiInputBase-input-86 MuiFilledInput-input-72')[2];



    await timeout(1000);
    corporateId.value = 'DP1'
    await corporateId.dispatchEvent(eve);

    loginId.value = 'ENTERER'
    await loginId.dispatchEvent(eve);

    password.value = 'password'
    await password.dispatchEvent(eve);

}

tryLogin()