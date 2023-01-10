function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { JoyStick } from './joystick';
import { ws } from '../../js/network';
import { checkOrReconnect } from '../network/checkConnection';
import { player, global_position } from '../../js/index';
import { transferMapTo } from '../data/map';
import { checkForCharacterCollision, rectangularCollision } from '../../game/utils/checkCollision';
import { boundaries, movables, characters } from '../../js/index';
import { others } from '../../js/network';
export var lastKey = '';
export var keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
};
window.addEventListener('keydown', function (e) {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});
window.addEventListener('keyup', function (e) {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});
var joy = new JoyStick('joyDiv');
var joyStickMoving = false;
export function joyToKey() {
  var x = joy.GetX();
  var y = joy.GetY();
  var moving = false;
  if (y > 45) {
    keys.w.pressed = true;
    lastKey = 'w';
    moving = true;
  } else if (y < -45) {
    keys.s.pressed = true;
    lastKey = 's';
    moving = true;
  } else if (x > 45) {
    keys.d.pressed = true;
    lastKey = 'd';
    moving = true;
  } else if (x < -45) {
    keys.a.pressed = true;
    lastKey = 'a';
    moving = true;
  } else if (joyStickMoving) {
    keys.w.pressed = false;
    keys.a.pressed = false;
    keys.s.pressed = false;
    keys.d.pressed = false;
    joyStickMoving = false;
  }
  joyStickMoving = moving;
}
export function moveUser(position, direction) {
  if (!checkOrReconnect()) return;
  if (player.map === 'MAIN' && global_position().x < 2200 && global_position().x > 2170 && global_position().y > 675 && global_position().y < 690) {
    console.log('테스트 맵으로 이동합니다.');
    transferMapTo('TEST');
  } else if (player.map === 'TEST' && global_position().x > 1870 && global_position().x < 1900 && global_position().y < 730 && global_position().y > 700) {
    console.log('메인 맵으로 이동합니다.');
    transferMapTo('MAIN');
  } else {
    var body = {
      Move: {
        coordinate: [position.x, position.y]
      }
    };
    var msg = JSON.stringify(body);
    ws.send(msg);
  }
}
export function stopUser(position) {
  if (!checkOrReconnect()) return;
  var body = {
    Move: {
      coordinate: [1, 1]
    }
  };
  var msg = JSON.stringify(body);
  ws.send(msg);
}
export function moveToXDirection(moving, direction) {
  var num = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var plusOrNot = direction === 'w' | direction === 'a' ? 1 : -1;
  var isX = direction === 'a' | direction === 'd' ? 1 : 0;
  var isY = direction === 'w' | direction === 's' ? 1 : 0;
  player.animate = true;
  player.image = direction === 'w' ? player.sprites.up : direction === 'a' ? player.sprites.left : direction === 'd' ? player.sprites.right : player.sprites.down;
  player.direction = direction === 'w' ? 0 : direction === 'a' ? 1 : direction === 'd' ? 3 : 2;
  checkForCharacterCollision({
    characters: characters,
    player: player,
    characterOffset: {
      x: 3 * num * plusOrNot * isX,
      y: 3 * num * plusOrNot * isY
    }
  });
  for (var i = 0; i < boundaries.length; i++) {
    var boundary = boundaries[i];
    if (rectangularCollision({
      rectangle1: player,
      rectangle2: _objectSpread(_objectSpread({}, boundary), {}, {
        position: {
          x: boundary.position.x + 3 * num * plusOrNot * isX,
          y: boundary.position.y + 3 * num * plusOrNot * isY
        }
      })
    })) {
      moving = false;
      break;
    }
  }
  if (moving) movables.forEach(function (movable) {
    movable.position.x += 3 * num * plusOrNot * isX;
    movable.position.y += 3 * num * plusOrNot * isY;
  });
  if (moving) for (var key in others) {
    others[key].sprite.position.x += 3 * num * plusOrNot * isX;
    others[key].sprite.position.y += 3 * num * plusOrNot * isY;
  }
}
export function moveToPosition(x, y) {
  movables.forEach(function (movable) {
    movable.position.x += 3 * x;
    movable.position.y += 3 * y;
  });
  for (var key in others) {
    others[key].sprite.position.x += 3 * x;
    others[key].sprite.position.y += 3 * y;
  }
}