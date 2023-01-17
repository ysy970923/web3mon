import { player, canvas } from '../js/index'
import { worker } from '../js/utils'
import { monsters } from '../game/data/monsters'
import { MultiWallet } from '../web/multi-wallet'
import { chosenCloth } from './initialSetting'
import { clothesList } from '../js/clothes'

export let playerUrl
export let tokenId

function truncate(input, length) {
  if (input.length > length) {
    return input.substring(0, length) + '...'
  }
  return input
}
window.wallet = new MultiWallet()
window.wallet.startUp()

/** temp login : only  */
export const temporaryLogin = async () => {
  var verified = await window.wallet.verifyOwner(
    window.collection,
    window.tokenId
  )
  if (!verified) {
    window.alert('Owner Verification Fail')
    // return
  }
  player.name = truncate(window.wallet.getAccountId(), 20)
  playerUrl = window.imgUrl
  document.getElementById('chatOpenBtn').style.display = 'block'
  // document.getElementById('loginDiv').style.display = 'none'
  document.getElementById('profileName').innerHTML = window.name
  document.getElementById('profileNFT').innerHTML = player.name
  document.getElementById('profileImg').src = playerUrl
  if (window.chain === 'near') {
    document.getElementById('parasUrl').addEventListener('click', (e) => {
      window
        .open(
          `https://paras.id/token/${window.contract.contractId}::${window.tokenId}/${window.tokenId}`,
          '_blank'
        )
        .focus()
    })
  }

  player.baseImage = new Image()

  worker.postMessage({
    url: playerUrl,
    leftSource: clothesList.find((doc) => doc.id === chosenCloth).left,
    rightSource: clothesList.find((doc) => doc.id === chosenCloth).right,
    downSource: clothesList.find((doc) => doc.id === chosenCloth).down,
    upSource: clothesList.find((doc) => doc.id === chosenCloth).up,
    contractAddress: window.collection,
    id: '-1',
  })

  turnToGameScreen()
}

/**
 * 메인화면을 display:none 처리하고, 게임화면을 display:block 한다.
 */
export const turnToGameScreen = () => {
  document.getElementById('login_screen').style.display = 'none'
  document.getElementById('game_screen').style.display = 'block'
  document.querySelector('canvas').style.display = 'block'

  console.log('canva', canvas)
}

export const logout = () => {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}
