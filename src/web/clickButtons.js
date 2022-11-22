import { authorize, temporaryLogin, realLogin } from './logIn'
import * as nearAPI from 'near-api-js'
import { chainConfigInit, author } from '../js/utils'

function clickOutSideEvent1(e) {
  if (!document.getElementById('guidanceCard').contains(e.target)) {
    document.body.removeEventListener('click', clickOutSideEvent1, true)
    document.getElementById('guidanceCard').style.display = 'none'
  }
}

document.getElementById('guidanceButton').addEventListener('click', (e) => {
  document.getElementById('guidanceCard').style.display = 'block'
  document.body.addEventListener('click', clickOutSideEvent1, true)
})

document.getElementById('closeResultBtn').addEventListener('click', (e) => {
  document.getElementById('battleResultCard').style.display = 'none'
})

function clickOutSideEvent(e) {
  if (!document.getElementById('profileCard').contains(e.target)) {
    document.body.removeEventListener('click', clickOutSideEvent, true)
    document.getElementById('profileCard').style.display = 'none'
  }
}

document.getElementById('profileButton').addEventListener('click', (e) => {
  document.getElementById('profileCard').style.display = 'block'
  document.body.addEventListener('click', clickOutSideEvent, true)
})

// 지갑 연결
document
  .getElementById('connectWallet')
  ?.addEventListener('click', async (e) => {
    await authorize()
  })

document
  .getElementById('contractAddress')
  ?.addEventListener('change', async (e) => {
    // await connectWallets(nearAPI)
  })

document.getElementById('find_my_nft').addEventListener('click', async (e) => {
  await chainConfigInit()
})

document
  .getElementById('find_my_login')
  .addEventListener('click', async (e) => {
    await author()
  })

document.getElementById('joinGame').addEventListener('click', (e) => {
  temporaryLogin()
})

const guideBtns = document.getElementsByClassName('guideBtn')
for (let i = 0; i < guideBtns.length; i++) {
  guideBtns.item(i).addEventListener('click', (e) => {
    const ee = document.getElementById('guideContainer')
    ee.scrollTop = 360 * i
  })
}
