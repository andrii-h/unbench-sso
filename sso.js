let data
const iframe = document.createElement('iframe')
iframe.id = 'inlineFrameExample'
iframe.width = 0
iframe.height = 0
iframe.style.display = 'none'
iframe.src = 'https://platform.unbench.us'
document.body.appendChild(iframe)

const CrossOriginLocalStorage = function (currentWindow, iframe, onMessage) {
  let childWindow
  try {
    childWindow = iframe.contentWindow
  } catch (e) {
    childWindow = iframe.contentWindow
  }

  currentWindow.onmessage = (event) => {
    if (typeof event.data !== 'string') {
      return
    }
    return onMessage(JSON.parse(event.data))
  }

  this.getData = (key) => {
    const messageData = {
      key: key,
      method: 'get',
    }
    this.postMessage(messageData)
  }

  this.setData = (key, data) => {
    const messageData = {
      key: key,
      method: 'set',
      data: data,
    }
    this.postMessage(messageData)
  }

  this.removeData = (key) => {
    const messageData = {
      key: key,
      method: 'remove',
    }
    this.postMessage(messageData)
  }

  this.postMessage = (messageData) => {
    childWindow.postMessage(JSON.stringify(messageData), '*')
  }
}

let cross

window.onload = () => {
  const onMessage = (payload) => {
    switch (payload.method) {
      case 'get':
        data = payload
        if (document.readyState !== 'complete') {
          document.addEventListener('DOMContentLoaded', appendAccount)
        } else {
          if (!payload['data']) {
            return
          }
          appendAccount()
        }
        break
      default:
        console.error('Unknown method "' + payload.method + '"', payload)
    }
  }

  const iframe = document.getElementById('inlineFrameExample')
  cross = new CrossOriginLocalStorage(window, iframe, onMessage)
  cross.getData('token')

  window.addEventListener('focus', function () {
    cross.getData('token')
  })
}

const removeToken = (e) => {
  cross.removeData('token')
  window.open('https://platform.unbench.us/signin', '_self')
}

const appendAccount = () => {

  document.querySelectorAll('.sign-up').forEach(i => i.remove())
  document.querySelector('.hero-btn-wrapper').remove()

  document.querySelectorAll('.log-in').forEach(i => {
    i.querySelector('.subtitle').innerHTML = 'Account'
    i.classList.add('account-btn')
    i.href = 'https://platform.unbench.us/account'
  })

  const menus = document.querySelectorAll('.menu-btn-items')
  const accountBtnWrapper = document.createElement('div')
  accountBtnWrapper.classList.add('account-btn-wrapper')

  const mobileMenuBtn = document.createElement('div')
  mobileMenuBtn.classList.add('account-btn-wrapper')
  mobileMenuBtn.style.flexGrow = 1
  mobileMenuBtn.innerHTML = `
       <a href="https://platform.unbench.us/account" target="_self" class="account-btn btn flex-hor w-inline-block" style="justify-content: center">
         <img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/Profile-white.svg" loading="lazy" alt="" class="profile-icon">
         <div class="subtitle white-text">Account</div>
       </a>
     `

  menus.forEach(i => {
    const btn = i.innerHTML
    i.innerHTML = ''
    i.classList.add('account-btn-position')
    accountBtnWrapper.innerHTML = `
${btn}
       <ul class="account-btn-sublist">
         <li class="account-btn-sublist-item">
           <div class="account-btn-sublist-name">
             <div class="account-btn-sublist-name-icon">${data?.username
      ? data.username[0]
      : ''}</div>
             <div>${data?.username || 'Account'}</div>
           </div>
         </li>
         <li class="account-btn-sublist-item">
           <a href="https://platform.unbench.us/requests"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-req.svg" loading="lazy" alt="" class="profile-icon">Requests</a>
         </li>
         <li class="account-btn-sublist-item">
           <a href="https://platform.unbench.us/companies"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-companies.svg" loading="lazy" alt="" class="profile-icon">Companies</a>
         </li>
         <li class="account-btn-sublist-item">
           <a href="https://platform.unbench.us/account"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-personal.svg" loading="lazy" alt="" class="profile-icon">Personal Area</a>
         </li>
         <li class="account-btn-sublist-item">
           <a href="https://platform.unbench.us/developers"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-bench.svg" loading="lazy" alt="" class="profile-icon">Bench</a>
         </li>
         <li class="account-btn-sublist-item">
           <a href="https://platform.unbench.us/chat"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-chat.svg" loading="lazy" alt="" class="profile-icon">Chat</a>
         </li>
         <li class="account-btn-sublist-item">
           <a href="#" onclick="removeToken()"><img src="https://cdn.jsdelivr.net/gh/andrii-h/unbench-sso/img/account-btn-logout.svg" loading="lazy" alt="" class="profile-icon">Log out</a>
         </li>
       </ul>
     `
    i.appendChild(accountBtnWrapper.cloneNode(true))
  })
  document.querySelector('.menu-btn-wrapper').appendChild(mobileMenuBtn)
}
