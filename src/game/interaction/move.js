var joy = new JoyStick('joyDiv')

let lastKey = ''
window.addEventListener('keydown', (e) => {
  console.log('클릭')
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

var joyStickMoving = false
function joyToKey() {
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
