const setChromeStorage = data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )

const getChromeStorage = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )

const removeChromeStorage = key =>
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

  await setChromeStorage({ loginData: loginData })

  let pageData = await getChromeStorage('loginData')
  console.log(pageData)
  await populateData();

}

const handleReset = async () => {
  await removeChromeStorage('loginData');
  await populateData();
  await handleSubmitButtonState()
}

const handleSubmitButtonState = async () => {

  let loginData = await getChromeStorage('loginData');

  let input1 = document.getElementById("userId")
  let input2 = document.getElementById('password')

  const stateHandle = () => {
    let button = document.getElementById("submitButton")
    if ((input1.value === "" || input2.value === "")) {
      button.disabled = true
      button.className = "submitDisable"
      button.value = "Submit"
    } else if (Object.keys(loginData).length === 0) {
      button.disabled = false
      button.className = "submitEnable"
      button.value = "Submit"
    } else {
      button.disabled = false
      button.className = "submitEnable"
      button.value = "Reset"
    }
  }
  stateHandle()
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

  let loginData = await getChromeStorage('loginData');
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

  }
  else {
    document.getElementById("userId").value = '';
    document.getElementById("password").value = '';
    document.getElementById("toggleButton").checked = false;
    for (let i = 1; i < 5; i++) {
      document.getElementById(`site${i}`).checked = false;
    }


  }
  await handleSubmitButtonState()
}

window.onload = populateData


