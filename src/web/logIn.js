import { player } from '../js/index'
import { worker } from '../js/utils'

export let playerUrl
export let tokenId

const nearConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://explorer.mainnet.near.org'
}

document.getElementById('joinGame').addEventListener('click', (e) => {
  // initContract 실행
  console.log('0')
  initContract().then(() => {
    console.log('1ㅏㅏㅏㅏ')
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
        document.getElementById('chatOpenBtn').style.display = 'block'
        document.getElementById('loginDiv').style.display = 'none'
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
        console.log('2')

        player.baseImage = new Image()
        worker.postMessage({
          url: playerUrl,
          contractAddress: window.contractAddress,
          id: '-1'
        })
      })
      .catch((err) => {
        console.log('에러', err)
      })
  })
})

// Initialize contract & set global variables
async function initContract() {
  window.contractAddress = document.getElementById('contractAddress').value
  // Initializing our contract APIs by contract name and configuration
  console.log('여기까지 실행')
  window.contract = await new nearApi.Contract(
    window.walletConnection.account(),
    window.contractAddress,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        'nft_token',
        'nft_metadata',
        'nft_tokens_for_owner',
        'nft_supply_for_owner'
      ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: []
    }
  )
  console.log('여기까지 실행22')
  window.metadata = await window.contract
    .nft_metadata()
    .then((res) => console.log('결과 ', res))
    .catch((err) => console.error(err, '에러러라구'))
  console.log('여기까지 실행3')
}

export async function connectWallets() {
  console.log('1')
  // Initialize connection to the NEAR testnet
  const near = await nearApi.connect(
    Object.assign(
      {
        deps: { keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore() }
      },
      nearConfig
    )
  )
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new nearApi.WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
  if (window.accountId !== '') await authorize()
}

async function authorize() {
  await initContract()
  var contract_address = document.getElementById('contractAddress').value
  window.walletConnection.requestSignIn(contract_address)
  var data = await window.contract.nft_tokens_for_owner({
    account_id: window.accountId,
    from_index: '0',
    limit: 50
  })
  // var data = await window.contract.nft_tokens_for_owner({ account_id: 'nearmoondao.near',  })
  document.querySelector('#nftListBox').innerHTML = ''
  document.getElementById('tokenId').value = ''
  if (data.length !== 0) {
    data.forEach((nft) => {
      var img = document.createElement('img')
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
const logout = () => {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}
