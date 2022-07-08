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

async function makeChracterImage(url, user) {
  const imageUrl = url
  let image = await Jimp.read({ url: imageUrl })
  const backgroundColor = image.getPixelColor(0, 0)
  const targetColor = Jimp.intToRGBA(backgroundColor)
  const replaceColor = { r: 0, g: 0, b: 0, a: 0 } // Color you want to replace with
  const colorDistance = (c1, c2) =>
    Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2) +
        Math.pow(c1.a - c2.a, 2)
    ) // Distance between two colors
  const threshold = 32 // Replace colors under this threshold. The smaller the number, the more specific it is.
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const thisColor = {
      r: image.bitmap.data[idx + 0],
      g: image.bitmap.data[idx + 1],
      b: image.bitmap.data[idx + 2],
      a: image.bitmap.data[idx + 3]
    }
    if (colorDistance(targetColor, thisColor) <= threshold) {
      image.bitmap.data[idx + 0] = replaceColor.r
      image.bitmap.data[idx + 1] = replaceColor.g
      image.bitmap.data[idx + 2] = replaceColor.b
      image.bitmap.data[idx + 3] = replaceColor.a
    }
  })
  image = image.resize(1600, 1600)
  image = image.crop(200, 200, 48 * 23, 48 * 23)
  image = image.resize(48, 48)
  let baseImage = await Jimp.read({ url: './img/playerDown.png' })
  baseImage = baseImage.composite(image, 0, 0)
  baseImage = baseImage.composite(image, 48, 0)
  baseImage = baseImage.composite(image, 48 * 2, 0)
  baseImage = baseImage.composite(image, 48 * 3, 0)

  return new Promise((resolve) => {
    baseImage.getBase64('image/png', (err, res) => {
      //   afterCrop.src = res
      user.sprites.down = new Image()
      user.sprites.down.src = res
      user.image = user.sprites.down
      resolve(res)
    })
  })
}

const CONTRACT_NAME = 'nft-frontend-simple-mint.blockhead.testnet'

function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org'
      }
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org'
      }
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        contractName: CONTRACT_NAME,
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
        contractName: CONTRACT_NAME
      }
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      }
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      }
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      )
  }
}
