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

const removeStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.remove(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  );

const handleSubmit = async () => {
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
      sites.push(site.id)
    }
  }

  let loginData = { userId: userId, password: password, autoLogin: autoLogin, sites: sites };

  await setStorageData({ loginData: loginData })

  let pageData = await getStorageData('loginData')
  console.log(pageData)
  await populateData();

}

const handleReset = async () => {
  await removeStorageData('loginData');
  await populateData();
  await handleSubmitButtonState()
}

const handleSubmitButtonState = async () => {

  let input1 = document.getElementById("userId")
  let input2 = document.getElementById('password')
  console.log('inputs', input1.value, input2.value)
  let button = document.getElementById("submitButton")
  button.disabled = true
  document.getElementById("submitButton").className = "submitDisable"
  const stateHandle = () => {
    if ((document.getElementById('userId').value === "" || document.getElementById('password').value === "")) {
      button.disabled = true
      document.getElementById("submitButton").className = "submitDisable"
    } else {
      button.disabled = false
      document.getElementById("submitButton").className = "submitEnable"
    }
  }
  input1.addEventListener("change", stateHandle)
  input2.addEventListener("change", stateHandle)
}


document.addEventListener('DOMContentLoaded', async function () {

  await populateData()

  await handleSubmitButtonState()

  const form = document.getElementById("loginForm")

  form.addEventListener('focusin', (event) => {
    event.target.style.background = '';
  });

  form.addEventListener('focusout', (event) => {
    event.target.style.background = '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    if (document.getElementById("submitButton").value == "Submit") {
      handleSubmit();
    }
    else {
      handleReset();
    }
  })
});


const populateData = async () => {

  let loginData = await getStorageData('loginData');
  console.log('loginData is...', loginData)
  if (!(loginData
    && Object.keys(loginData).length === 0
    && Object.getPrototypeOf(loginData) === Object.prototype)) {
    console.log('inside if...')
    document.getElementById("userId").value = loginData.loginData.userId ? loginData.loginData.userId : '';
    document.getElementById("password").value = loginData.loginData.password ? loginData.loginData.password : '';
    document.getElementById("toggleButton").checked = loginData.loginData.autoLogin ? true : false;

    const sites = loginData.loginData.sites;
    if (sites.length) {
      console.log('sites are, ', sites);
      sites.forEach((site) => {
        document.getElementById(site).checked = loginData.loginData.autoLogin ? true : false;
      });
    }
    document.getElementById("submitButton").value = "Reset"
  }
  else {
    document.getElementById("userId").value = '';
    document.getElementById("password").value = '';
    document.getElementById("toggleButton").checked = false;
    for (let i = 1; i < 5; i++) {
      document.getElementById(`site${i}`).checked = false;
    }
    document.getElementById("submitButton").value = "Submit"

  }
}

window.onload = populateData


