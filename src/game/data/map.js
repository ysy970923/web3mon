import { Sprite } from '../object/Sprite'
import { player, renderables } from '../../js/index'
import {
  mainBackgroundImage,
  foregroundImage,
  battleBackgroundImage,
} from '../../js/load'
import { ws } from '../../js/network'

const offset = {
  x: window.innerWidth / 2 - 3360 / 2,
  y: window.innerHeight / 2 - 1920 / 2,
}

const MAP = {
  MAIN: 'MAIN',
  TEST: 'TEST',
}

export const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: mainBackgroundImage,
})

export const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
})

export function transferMap(toMap) {
  console.log('맵이동', player.map, '에서 ', toMap, '으로')
  // map 이동의 효과 : 뭐가 있을까?
  // map UI 자체 변경 -> renderables, movables, boundaries 가 바뀌는 것
  // map에 존재하는 유저들 변경
  player.map = toMap
  player.chat = '맵이동' + toMap

  if (toMap === MAP.TEST) {
    document.getElementById('map_identifier').innerText =
      'BATTLE map : you can fight here!'
    // background.image = battleBackgroundImage
    const body = {
      MapTransfer: {
        from: 'MAIN',
        to: 'TEST',
      },
    }
    const msg = JSON.stringify(body)
    ws.send(msg)
  } else if (toMap === MAP.MAIN) {
    document.getElementById('map_identifier').innerText =
      'MAIN map : you cannot fight here!'

    // background.image = mainBackgroundImage
    const body = {
      MapTransfer: {
        from: 'TEST',
        to: 'MAIN',
      },
    }
    const msg = JSON.stringify(body)
    ws.send(msg)
  }
}
