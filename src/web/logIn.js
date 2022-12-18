import { player, canvas } from '../js/index'
import { worker } from '../js/utils'
import { monsters } from '../game/data/monsters'
import * as nearApi from 'near-api-js'
import { binary_to_base58 } from 'base58-js'
import axios from 'axios'

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

export async function connectWallets(nearAPI) {
  console.log('연결 실행')
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
  console.log('연결 끝', window.accountId, 'ㅁㅇㅈ')
  if (window.accountId !== '') await authorize()
  console.log('연결 끝22', window.accountId)
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

  // NFT 목록으로 채워넣기
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

/** temp login : only  */
export const temporaryLogin = async () => {
  const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore()

  const keyPair = await keyStore.getKey(
    'mainnet',
    window.walletConnection.getAccountId()
  ) // wallet account id address

  let msg = {}
  msg = Buffer.from(JSON.stringify(msg))
  var signature = keyPair.sign(msg)

  console.log('값', signature)
  console.log('시그니쳐', signature.publicKey.toString().slice(8))
  console.log('베이스 사용', binary_to_base58(signature.signature))

  const body = {
    signature: binary_to_base58(signature.signature),
    // 'bf25fdefb39ed17928b004cbf3cc7801bdb56c9dc0aeda8ebdc750e92d09c73b278b3dbb60f58df7f183009598db3d88a3e4ec42374ecae9f578eddf8bea6009',
    message: {
      chain: 'NEAR',
      collection: window.collection,
      token_id: window.tokenId,
      pub_key: signature.publicKey.toString().slice(8),
      // '626f4662dc3dffc6ab65bbf0faa36372ef4c44a09cbe8e31e520d84322c18c39',
      extra_info: {
        near_account_id: 'web3mon_test.near',
      },
    },
  }

  const config = {
    withCredentials: true, // 쿠키 cors 통신 설정
    OPTIONS: 'http://ec2-44-201-5-87.compute-1.amazonaws.com:8080',
    headers: {
      'Access-Control-Allow-Origin': '*',
      post: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  }

  // axios
  //   .post('http://ec2-44-201-5-87.compute-1.amazonaws.com:8080/login', body, {
  //     withCredentials: true, // 쿠키 cors 통신 설정
  //   })
  //   .then((res) => {
  //     console.log('답 ', res)
  //   })
  //   .catch((err) => {
  //     console.log('에러', err)
  //   })

  // return

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
    leftSource: clothesList.find((doc) => doc.id === chosenCloth).left,
    rightSource: clothesList.find((doc) => doc.id === chosenCloth).right,
    downSource: clothesList.find((doc) => doc.id === chosenCloth).down,
    upSource: clothesList.find((doc) => doc.id === chosenCloth).up,
    contractAddress: window.collection,
    id: '-1',
  })

  turnToGameScreen()
}

/** original real login */
export const realLogin = () => {
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
export const turnToGameScreen = () => {
  document.getElementById('login_screen').style.display = 'none'
  document.getElementById('game_screen').style.display = 'block'
  document.querySelector('canvas').style.display = 'block'

  console.log('canva', canvas)
}

// Initialize contract & set global variables
export async function initContract(nearAPI) {
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
