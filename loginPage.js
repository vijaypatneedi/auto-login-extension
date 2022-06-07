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

  let pageData = {};

  let eve = new Event('input', { bubbles: true, cancelable: false });

  const userId = document.getElementById('email');
  const password = document.getElementById('password');

  pageData = await getStorageData('loginData')
  console.log('data is', pageData, pageData.loginData, pageData.loginData.userId)
  userId.value = pageData.loginData.userId.toString();
  password.value = pageData.loginData.password.toString();

  await userId.dispatchEvent(eve);
  await password.dispatchEvent(eve);
  await document.querySelector('button[type="submit"]').click()
}