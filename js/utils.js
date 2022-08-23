function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function checkForCharacterCollision({
    characters,
    player,
    characterOffset = { x: 0, y: 0 }
}) {
    // monitor for character collision
    for (let i = 0; i < characters.length; i++) {
        const character = characters[i]

        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...character,
                    position: {
                        x: character.position.x + characterOffset.x,
                        y: character.position.y + characterOffset.y
                    }
                }
            })
        ) {
            console.log('go')
        }
    }
}

var worker = new Worker("./js/worker.js")
worker.onmessage = function (event) {
    console.log(event.data)
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
        }
        else {
            others[event.data.id].sprite.sprites.up.src = event.data.up
            others[event.data.id].sprite.sprites.down.src = event.data.down
            others[event.data.id].sprite.sprites.left.src = event.data.left
            others[event.data.id].sprite.sprites.right.src = event.data.right
            others[event.data.id].baseImage.src = event.data.baseImage
            others[event.data.id].sprite.image = others[event.data.id].sprite.sprites.down
            others[event.data.id].draw = true
        }
    }
    console.log(typeof player.image.src)
    console.log(typeof others['250'].sprite.image.src)
}
worker.onerror = function (err) {
    console.log(err)
}

const nearConfig = {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org'
}

async function connectWallet() {
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
    console.log(window.walletConnection.account())
    if (window.accountId !== "")
        await authorize()
}

async function authorize() {
    await initContract()
    var contract_address = document.getElementById('contractAddress').value
    window.walletConnection.requestSignIn(contract_address)
    var data = await window.contract.nft_tokens_for_owner({ account_id: window.accountId, from_index: '0', limit: 50 })
    // var data = await window.contract.nft_tokens_for_owner({ account_id: 'nearmoondao.near',  })
    document.querySelector('#nftListBox').innerHTML = ""
    document.getElementById('tokenId').value = ""
    if (data.length !== 0) {
        data.forEach((nft) => {
            var img = document.createElement('img')
            if (nft.metadata.media.includes('https://'))
                img.src = nft.metadata.media
            else
                img.src = window.metadata.base_uri + '/' + nft.metadata.media
            img.style.width = "100px"
            img.style.opacity = 0.5
            img.onclick = () => {
                img.style.opacity = 1.5 - img.style.opacity
                document.getElementById('tokenId').value = nft.token_id
            }
            document.querySelector('#nftListBox').append(img)
        })
    }
    document.getElementById('connectedWallet').innerHTML = `Connected Wallet: ${window.accountId}`
}

// Initialize contract & set global variables
async function initContract() {
    window.contractAddress = document.getElementById('contractAddress').value
    // Initializing our contract APIs by contract name and configuration
    window.contract = await new nearApi.Contract(
        window.walletConnection.account(),
        window.contractAddress,
        {
            // View methods are read only. They don't modify the state, but usually return some value.
            viewMethods: ['nft_token', 'nft_metadata', 'nft_tokens_for_owner', 'nft_supply_for_owner'],
            // Change methods can modify the state. But you don't receive the returned value when called.
            changeMethods: []
        }
    )
    console.log(window.contract)
    window.metadata = await window.contract.nft_metadata()
    console.log(window.metadata)
}

function logout() {
    console.log("logout")
    window.walletConnection.signOut()
    // reload page
    window.location.replace(window.location.origin + window.location.pathname)
}