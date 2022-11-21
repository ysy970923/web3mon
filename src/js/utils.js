import { others, connect } from './network'
import { player } from './index'
import { animate } from '../game/animate'
import * as nearApi from 'near-api-js'

export const worker = new Worker('./js/worker.js')
window.walletConnection

worker.onmessage = function (event) {
  if (event.data) {
    if (event.data.id === '-1') {
      player.sprites.up.src = event.data.up
      player.sprites.down.src = event.data.down
      player.sprites.left.src = event.data.left
      player.sprites.right.src = event.data.right
      player.baseImage.src = event.data.baseImage
      player.image = player.sprites.down
      document.getElementById('loading').style.display = 'none'
      animate()
      connect()
    } else {
      others[event.data.id].sprite.sprites.up.src = event.data.up
      others[event.data.id].sprite.sprites.down.src = event.data.down
      others[event.data.id].sprite.sprites.left.src = event.data.left
      others[event.data.id].sprite.sprites.right.src = event.data.right
      others[event.data.id].baseImage.src = event.data.baseImage
      others[event.data.id].sprite.image =
        others[event.data.id].sprite.sprites.down
      others[event.data.id].draw = true
    }
  }
}
worker.onerror = function (err) {
  console.log(err)
}

const nearConfig = {
  networkId: 'mainnet',
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://explorer.mainnet.near.org',
}

export async function author() {
  console.log(
    '브라우저 로컬 스토리지',
    new nearApi.keyStores.BrowserLocalStorageKeyStore()
  )
  const near = await nearApi.connect(
    Object.assign(
      {
        deps: { keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore() },
      },
      nearConfig
    )
  )
  // const nearConnection = await nearApi.connect(nearConfig)

  const walletConnection = new nearApi.WalletConnection(near)
  console.log('월렛 커넥션', walletConnection)
  await walletConnection.requestSignIn('web3mon.near') // our game contract address
}

export async function chainConfigInit() {
  window.chain = document.getElementById('chainType').value // NEAR Protocol
  window.collection = document.getElementById('contractAddress').value // NPunks
  window.accountId = document.getElementById('accountId').value // khjdaniel.near

  if (
    window.chain === '' ||
    window.collection === '' ||
    window.accountId === ''
  )
    return

  // 체인이 니어일 때
  if (window.chain === 'near') {
    const nearConnection = await nearApi.connect(nearConfig)

    const walletConnection = new nearApi.WalletConnection(nearConnection)

    // await walletConnection.requestSignIn('web3mon.near') // our game contract address

    var keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore()
    var keyPair = await keyStore.getKey(
      'mainnet',
      walletConnection.getAccountId()
    ) // wallet account id address
    var msg = {}
    // msg = Buffer.from(JSON.stringify(msg))
    // var signature = keyPair.sign(msg)
    // console.log(signature)

    window.contract = await new nearApi.Contract(
      walletConnection.account(),
      window.collection,
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

    var metadata = await window.contract.nft_metadata() // 이 NFT collection의 정보

    var data = await window.contract.nft_tokens_for_owner({
      account_id: window.accountId,
      from_index: '0',
      limit: 50,
    })

    // 초기화
    document.querySelector('#nftListBox').innerHTML = ''
    document.getElementById('tokenId').value = ''
    let imgs = []

    if (data.length !== 0) {
      data.forEach((nft) => {
        let src = ''
        if (nft.metadata.media.includes('https://')) src = nft.metadata.media
        else src = metadata.base_uri + '/' + nft.metadata.media

        const name = metadata.name + ' #' + (Number(nft.metadata.title) + 1)

        let img = document.createElement('img')
        img.src = src
        img.style = 'width: 100px; opacity: 0.5;'
        img.onclick = () => {
          onImgClick(img, nft.token_id, name)
        }
        imgs.push(img)
      })
    } else {
      let p = document.createElement('p')
      p.innerHTML = 'There is no NFT'
      document.querySelector('#nftListBox').appendChild(p)
    }

    imgs.forEach((i) => {
      document.querySelector('#nftListBox').appendChild(i)
    })
  }

  // 체인이 알고랜드일 때
  if (window.chain === 'algo') {
    const base_url =
      'https://broken-spring-moon.algorand-mainnet.discover.quiknode.pro/index/v2/'
    const url = `accounts/${window.accountId}/assets`

    var res = await fetch(base_url + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    res = await res.json()

    // 초기화
    document.querySelector('#nftListBox').innerHTML = ''
    document.getElementById('tokenId').value = ''
    let imgs = []

    for (var i in res.assets) {
      var nft = res.assets[i]
      if (nft.amount !== 1) continue
      let url = `assets/${nft['asset-id']}`

      var nft_data = await fetch(base_url + url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      nft_data = await nft_data.json()
      if (nft_data.asset.params['unit-name'] === undefined) continue
      if (nft_data.asset.params['unit-name'].startsWith(window.collection)) {
        let img = document.createElement('img')
        console.log(nft['asset-id'])

        img.src = `https://ipfs.io/ipfs/${nft_data.asset.params.url.replace(
          'ipfs://',
          ''
        )}`
        img.style = 'width: 100px; opacity: 0.5;'
        img.onclick = onImgClick(img, nft['asset-id'], nft['name'])
        imgs.push(img)
      }
    }

    imgs.forEach((i) => {
      document.querySelector('#nftListBox').appendChild(i)
    })
  }
}

let prevSelect = undefined
function onImgClick(img, asset_id, nft_name) {
  if (prevSelect !== undefined) prevSelect.style.opacity = 0.5
  img.style.opacity = 1.0
  prevSelect = img

  document.getElementById('tokenId').value = asset_id
  window.imgUrl = img.src
  window.name = nft_name
  window.tokenId = document.getElementById('tokenId').value
}
