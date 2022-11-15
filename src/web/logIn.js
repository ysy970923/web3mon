import { player, canvas } from '../js/index'
import { worker } from '../js/utils'
import { monsters } from '../game/data/monsters'
import * as nearAPI from 'near-api-js'

export let playerUrl
export let tokenId

function truncate(input, length) {
  if (input.length > length) {
    return input.substring(0, length) + '...'
  }
  return input
}

export async function connectWallets(nearAPI) {
  const nearConfig = {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  }
  // Initialize connection to the NEAR testnet

  const near = await nearAPI.connect(
    Object.assign(
      {
        deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() },
      },
      nearConfig
    )
  )
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new nearAPI.WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
  if (window.accountId !== '') await authorize()
}

export async function authorize() {
  await initContract()
  const contract_address = document.getElementById('contractAddress').value
  if (!window.accountId) window.walletConnection.requestSignIn(contract_address)

  const data = await window.contract.nft_tokens_for_owner({
    account_id: window.accountId,
    from_index: '0',
    limit: 50,
  })

  document.querySelector('#nftListBox').innerHTML = ''
  document.getElementById('tokenId').value = ''

  if (data.length !== 0) {
    data.forEach((nft) => {
      let img = document.createElement('img')
      if (nft.metadata.media.includes('https://')) img.src = nft.metadata.media
      else img.src = window.metadata.base_uri + '/' + nft.metadata.media
      img.style.width = '100px'
      img.style.opacity = 0.5
      img.onclick = () => {
        img.style.opacity = 1.5 - img.style.opacity
        document.getElementById('tokenId').value = nft.token_id
      }
      document.querySelector('#nftListBox').append(img)
    })
  }

  document.getElementById(
    'connectedWallet'
  ).innerHTML = `Connected Wallet: ${window.accountId}`
}

document.getElementById('joinGame').addEventListener('click', (e) => {
  temporaryLogin()
})

const temporaryLogin = () => {
  player.name = truncate(window.accountId, 20)
  playerUrl = window.imgUrl
  document.getElementById('chatOpenBtn').style.display = 'block'
  // document.getElementById('loginDiv').style.display = 'none'
  document.getElementById('profileName').innerHTML = window.name
  document.getElementById('profileNFT').innerHTML = player.name
  document.getElementById('profileImg').src = playerUrl
  document.getElementById('profileHP').innerHTML =
    'HP: ' + monsters[window.collection].health
  document.getElementById('profileAP').innerHTML =
    'AP: ' + monsters[window.collection].attacks[0].damage
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
    contractAddress: window.collection,
    id: '-1',
  })
  turnToGameScreen()
}

const realLogin = () => {
  initContract().then(() => {
    tokenId = document.getElementById('tokenId').value
    window.contract
      .nft_token({ token_id: tokenId })
      .then((msg) => {
        if (msg === null) {
          window.alert('invalid token id')
          return
        }
        player.name = truncate(msg.owner_id, 20)
        if (msg.metadata.media.includes('https://'))
          playerUrl = msg.metadata.media
        else playerUrl = window.metadata.base_uri + '/' + msg.metadata.media
        document.getElementById('profileName').innerHTML =
          window.metadata.name + ' #' + (Number(msg.metadata.title) + 1)
        document.getElementById('profileNFT').innerHTML = player.name
        document.getElementById('profileImg').src = playerUrl
        document.getElementById('profileHP').innerHTML =
          'HP: ' + monsters[window.contractAddress].health
        document.getElementById('profileAP').innerHTML =
          'AP: ' + monsters[window.contractAddress].attacks[0].damage
        document.getElementById('parasUrl').addEventListener('click', (e) => {
          window
            .open(
              `https://paras.id/token/${window.contract.contractId}::${msg.token_id}/${msg.token_id}`,
              '_blank'
            )
            .focus()
        })

        turnToGameScreen()
        player.baseImage = new Image()
        player.position.x = canvas.width / 2 - 192 / 4 / 2
        player.position.y = canvas.height / 2 - 102 / 2

        worker.postMessage({
          url: playerUrl,
          contractAddress: window.contractAddress,
          id: '-1',
        })
        window.isLoggedIn = true
      })
      .catch((err) => console.log(err))
  })
}

/**
 * 메인화면을 display:none 처리하고, 게임화면을 display:block 한다.
 */
const turnToGameScreen = () => {
  document.getElementById('login_screen').style.display = 'none'
  document.getElementById('game_screen').style.display = 'block'
  document.querySelector('canvas').style.display = 'block'

  console.log('canva', canvas)
}

// Initialize contract & set global variables
async function initContract() {
  window.contractAddress = document.getElementById('contractAddress').value
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new nearAPI.Contract(
    window.walletConnection.account(),
    window.contractAddress,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        'nft_token',
        'nft_metadata',
        'nft_tokens_for_owner',
        'nft_supply_for_owner',
      ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [],
    }
  )
  window.metadata = await window.contract.nft_metadata()
}
export const logout = () => {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}
