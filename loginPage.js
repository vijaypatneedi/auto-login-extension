// login Page content script

const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )



async function tryLogin() {

  let loginData = {};

  let eve = new Event('input', { bubbles: true, cancelable: false });

  const userId = document.getElementById('email');
  const password = document.getElementById('password');

  loginData = await getStorageData('loginData')

  if (Object.keys(loginData).length !== 0) {
    userId.value = loginData.loginData.userId.toString();
    password.value = loginData.loginData.password.toString();

    await userId.dispatchEvent(eve);
    await password.dispatchEvent(eve);
    await document.querySelector('button[type="submit"]').click()
  }
}

tryLogin()