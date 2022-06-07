const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )

const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("loginForm")

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    let userIdElement = document.getElementById('userId')
    let userId = userIdElement.value.trim()

    let passwordElement = document.getElementById('password')
    let password = passwordElement.value.trim()

    let autoLoginFlag = document.getElementById('toggleButton')
    let autoLogin = autoLoginFlag.checked


    let sites = []
    for (let i = 1; i < 5; i++) {
      let site = document.getElementById(`site${i}`)
      let isSiteExist = sites.filter(s => s === site.value)[0]
      if (site.checked && !isSiteExist) {
        sites.push(site.value)
      }
    }

    let loginData = { userId: userId, password: password, autoLogin: autoLogin, sites: sites };

    (async () => {
      await setStorageData({ loginData: loginData })
    })();

    (async () => {
      let pageData = await getStorageData('loginData')
      console.log(pageData)
    })();

  })
});





function onPageLoad() {

  let loginData = JSON.parse(localStorage.getItem('loginData'));
  if (loginData) {
    document.getElementById("userId").value = loginData.userId ? loginData.userId : ''
    document.getElementById("password").value = loginData.password ? loginData.password : ''
  }


}

window.onload = onPageLoad


