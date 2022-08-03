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

const colorDistance = (c1, c2) =>
    Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2) +
        Math.pow(c1.a - c2.a, 2)
    )

async function makeChracterImage(url, user) {
    var image = await Jimp.read({ url: url })
    image = image.resize(48 * 4, 48 * 4)
    var h = image.bitmap.height;

    const replaceColor = { r: 0, g: 0, b: 0, a: 0 } // Color you want to replace with
    const targetColors = []
    for (var i = 0; i < 3; i++) {
        targetColors.push(Jimp.intToRGBA(image.getPixelColor(0, Math.floor(i * h / 3))))
    }
    // Distance between two colors
    const threshold = 32 // Replace colors under this threshold. The smaller the number, the more specific it is.
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const thisColor = {
            r: image.bitmap.data[idx + 0],
            g: image.bitmap.data[idx + 1],
            b: image.bitmap.data[idx + 2],
            a: image.bitmap.data[idx + 3]
        }
        for (var i = 0; i < 3; i++) {
            var targetColor = targetColors[i]
            if (colorDistance(targetColor, thisColor) <= threshold) {
                image.bitmap.data[idx + 0] = replaceColor.r
                image.bitmap.data[idx + 1] = replaceColor.g
                image.bitmap.data[idx + 2] = replaceColor.b
                image.bitmap.data[idx + 3] = replaceColor.a
                break
            }
        }

    })

    user.baseImage = new Image()
    user.baseImage.src = await image.getBase64Async('image/png')

    image = image.crop(27, 24, 127, 127)

    image = image.resize(48, 48)

    var downImage = await Jimp.read({ url: './img/playerDown.png' })
    downImage = downImage.composite(image, 0, 0)
    downImage = downImage.composite(image, 48, 0)
    downImage = downImage.composite(image, 48 * 2, 0)
    downImage = downImage.composite(image, 48 * 3, 0)
    user.sprites.down = new Image()
    user.sprites.down.src = await downImage.getBase64Async('image/png')
    user.image = user.sprites.down

    var upImage = await Jimp.read({ url: './img/playerUp.png' })
    upImage = upImage.composite(image, 0, 0)
    upImage = upImage.composite(image, 48, 0)
    upImage = upImage.composite(image, 48 * 2, 0)
    upImage = upImage.composite(image, 48 * 3, 0)
    user.sprites.up = new Image()
    user.sprites.up.src = await upImage.getBase64Async('image/png')

    var leftImage = await Jimp.read({ url: './img/playerLeft.png' })
    leftImage = leftImage.composite(image, 0, 0)
    leftImage = leftImage.composite(image, 48, 0)
    leftImage = leftImage.composite(image, 48 * 2, 0)
    leftImage = leftImage.composite(image, 48 * 3, 0)
    user.sprites.left = new Image()
    user.sprites.left.src = await leftImage.getBase64Async('image/png')

    var rightImage = await Jimp.read({ url: './img/playerRight.png' })
    rightImage = rightImage.composite(image, 0, 0)
    rightImage = rightImage.composite(image, 48, 0)
    rightImage = rightImage.composite(image, 48 * 2, 0)
    rightImage = rightImage.composite(image, 48 * 3, 0)
    user.sprites.right = new Image()
    user.sprites.right.src = await rightImage.getBase64Async('image/png')
}

function getConfig(env) {
    switch (env) {
        case 'production':
        case 'mainnet':
            return {
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                walletUrl: 'https://wallet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
                explorerUrl: 'https://explorer.mainnet.near.org'
            }
        case 'development':
        case 'testnet':
            return {
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                explorerUrl: 'https://explorer.testnet.near.org'
            }
        case 'betanet':
            return {
                networkId: 'betanet',
                nodeUrl: 'https://rpc.betanet.near.org',
                walletUrl: 'https://wallet.betanet.near.org',
                helperUrl: 'https://helper.betanet.near.org',
                explorerUrl: 'https://explorer.betanet.near.org'
            }
        case 'local':
            return {
                networkId: 'local',
                nodeUrl: 'http://localhost:3030',
                keyPath: `${process.env.HOME}/.near/validator_key.json`,
                walletUrl: 'http://localhost:4000/wallet',
            }
        case 'test':
        case 'ci':
            return {
                networkId: 'shared-test',
                nodeUrl: 'https://rpc.ci-testnet.near.org',
                masterAccount: 'test.near'
            }
        case 'ci-betanet':
            return {
                networkId: 'shared-test-staging',
                nodeUrl: 'https://rpc.ci-betanet.near.org',
                masterAccount: 'test.near'
            }
        default:
            throw Error(
                `Unconfigured environment '${env}'. Can be configured in src/config.js.`
            )
    }
}

const nearConfig = getConfig('production')

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
    var data = await window.contract.nft_tokens_for_owner({ account_id: window.accountId, from_index: '0', limit:50 })
    // var data = await window.contract.nft_tokens_for_owner({ account_id: 'nearmoondao.near',  })
    document.querySelector('#nftListBox').innerHTML = ""
    document.getElementById('tokenId').value = ""
    console.log(data)
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