import { JoyStick } from './joystick'
import { checkOrReconnect, ws, myID, TypeToNum } from '../../js/network'
import { MOVE } from '../network/callType'

export let lastKey = ''

export let keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

var joy = new JoyStick('joyDiv')
var joyStickMoving = false
export function joyToKey() {
  var x = joy.GetX()
  var y = joy.GetY()
  var moving = false
  if (y > 45) {
    keys.w.pressed = true
    lastKey = 'w'
    moving = true
  } else if (y < -45) {
    keys.s.pressed = true
    lastKey = 's'
    moving = true
  } else if (x > 45) {
    keys.d.pressed = true
    lastKey = 'd'
    moving = true
  } else if (x < -45) {
    keys.a.pressed = true
    lastKey = 'a'
    moving = true
  } else if (joyStickMoving) {
    keys.w.pressed = false
    keys.a.pressed = false
    keys.s.pressed = false
    keys.d.pressed = false
    joyStickMoving = false
  }
  joyStickMoving = moving
}

export function moveUser(position, direction) {
  if (!checkOrReconnect()) return

  const body = {
    Move: {
      coordinate: [position.x, position.y],
    },
  }
  // type: MOVE.OTHER_USER,
  // myID: myID,
  // x: position.x,
  // y: position.y,
  // direction: direction,

  const msg = JSON.stringify(body)

  console.log('진짜 메세지를 보냄?', typeof position.x)
  ws.send(msg)
}

export function stopUser(position) {
  if (!checkOrReconnect()) return

  const body = {
    type: MOVE.STOP,
    myID: myID,
    x: position.x,
    y: position.y,
  }

  const msg = JSON.stringify(body)
  ws.send(msg)
}
