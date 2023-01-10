function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { collisions } from '../game/data/collisions';
import { battleZonesData } from '../game/data/battleZones';
import { charactersMapData } from '../game/data/characters';
import { Boundary } from '../game/object/Boundary';
import { Sprite } from '../game/object/Sprite';
import { others } from './network';
import { worker } from './utils';
import { rectangularCollision } from '../game/utils/checkCollision';
import * as nearAPI from 'near-api-js';
import { gsap } from 'gsap';
import { background, foreground } from '../game/data/map';
import { clickEvent } from '../game/battle/battleStart';
import { clothesList } from './clothes';
import { moveToXDirection } from '../game/interaction/move';
import { lastKey } from '../game/interaction/move';
import { initBattle } from './battleScene';

// 최초로 지갑 연결
// connectWallets(nearAPI)

// export const playerDownImage = playerDownImages

export var stopAllPlay = false;
export var setStopAllPlay = function setStopAllPlay(bol) {
  stopAllPlay = bol;
};
export var playerDownImage = new Image();
playerDownImage.src = 'img/playerDown.png';
export var canvas = document.querySelector('canvas');
clickEvent();
var body = document.querySelector('body');
body.addEventListener('keydown', function (event) {
  if (document.getElementById('chatForm').style.display !== 'none') {
    return;
  }
  var key = event.code;
  var keyCode = event.keyCode;
  if (key === 'Space' || keyCode === 32) {
    moveToXDirection(true, lastKey, 4);
    moveToXDirection(true, lastKey, 4);
    var time = setTimeout(function () {
      moveToXDirection(true, lastKey, 4);
      moveToXDirection(true, lastKey, 4);
      clearTimeout(time);
    }, 100);
    event.preventDefault();
  }
});
export var canva = canvas.getContext('2d');
export var collisionsMap = [];
for (var i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}
export var battleZonesMap = [];
for (var _i = 0; _i < battleZonesData.length; _i += 70) {
  battleZonesMap.push(battleZonesData.slice(_i, 70 + _i));
}
export var charactersMap = [];
for (var _i2 = 0; _i2 < charactersMapData.length; _i2 += 70) {
  charactersMap.push(charactersMapData.slice(_i2, 70 + _i2));
}
export var boundaries = [];
export var setBoundaries = function setBoundaries(bound) {
  boundaries = bound;
};
export var mainMapBoundaries = [];
export var battleMapBoundaries = [];
export var offset = {
  x: window.innerWidth / 2 - 3360 / 2,
  y: window.innerHeight / 2 - 1920 / 2
};
collisionsMap.forEach(function (row, i) {
  row.forEach(function (symbol, j) {
    if (symbol === 1025) mainMapBoundaries.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      },
      type: 'collision'
    }));
  });
});
export var battleZones = [];

// battleZonesMap.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     if (symbol === 1025)
//       battleZones.push(
//         new Boundary({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y,
//           },
//           type: 'battle',
//         })
//       )
//   })
// })

export var characters = [];
var villagerImg = new Image();
villagerImg.src = '../img/villager/Idle.png';
var oldManImg = new Image();
oldManImg.src = '../img/oldMan/Idle.png';
var kobugi = new Image();
kobugi.src = '../img/oldMan/kobugi.png';
charactersMap.forEach(function (row, i) {
  row.forEach(function (symbol, j) {
    // 1026 === villager
    if (symbol === 1026) {
      characters.push(new Sprite({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        },
        image: kobugi,
        frames: {
          max: 4,
          hold: 60
        },
        scale: 3,
        animate: true
      }));
    }
    // 1031 === oldMan
    else if (symbol === 1031) {
      characters.push(new Sprite({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        },
        image: kobugi,
        frames: {
          max: 4,
          hold: 60
        },
        scale: 3
      }));
    }
    if (symbol !== 0) {
      mainMapBoundaries.push(new Boundary({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      }));
    }
  });
});
export var player = new Sprite({
  position: {
    x: window.innerWidth / 2 - 192 / 4 / 2,
    y: window.innerHeight / 2 - 102 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: new Image(),
    left: new Image(),
    right: new Image(),
    down: new Image()
  },
  name: '',
  direction: 0,
  nftName: 'Npunks',
  myCharacter: true
});
setBoundaries(mainMapBoundaries);
export var movables = [background].concat(_toConsumableArray(boundaries), [foreground], battleZones, characters);
export var renderables = [background].concat(_toConsumableArray(boundaries), battleZones, characters, [player, foreground]);
export var setMovables = function setMovables(mova) {
  movables = mova;
};
export var setRenderables = function setRenderables(rend) {
  renderables = rend;
};
export var battle = {
  initiated: false,
  ready: true
};
export function global_position() {
  return {
    x: player.position.x - background.position.x,
    y: player.position.y - background.position.y
  };
}
export function local_position(position) {
  return {
    x: position.x + background.position.x,
    y: position.y + background.position.y
  };
}
export function checkCollision(a, b) {
  var overlappingArea = (Math.min(a.position.x + a.width, b.position.x + b.width) - Math.max(a.position.x, b.position.x)) * (Math.min(a.position.y + a.height, b.position.y + b.height) - Math.max(a.position.y, b.position.y));
  return rectangularCollision({
    rectangle1: a,
    rectangle2: b
  }) && overlappingArea > a.width * a.height / 10;
}

// Jaewon NPC 생성
var makeNPC = function makeNPC() {
  others['250'] = {
    draw: false,
    collection: 'asac.near',
    skillType: 1,
    sprite: new Sprite({
      position: {
        x: 100,
        y: 200
      },
      image: playerDownImage,
      frames: {
        max: 4,
        hold: 10
      },
      sprites: {
        up: new Image(),
        left: new Image(),
        right: new Image(),
        down: new Image()
      },
      name: 'jaewon.near (BOT)'
    })
  };
  others['250'].baseImage = new Image();
  worker.postMessage({
    url: 'https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/129.png',
    contractAddress: 'asac.near',
    id: '250',
    leftSource: clothesList[0].left,
    rightSource: clothesList[0].right,
    upSource: clothesList[0].up,
    downSource: clothesList[0].down
  });
};
initalSetting();
function initalSetting() {
  document.getElementById('map_identifier').innerText = 'MAIN map : you cannot fight here!';
}

// make other charaters or objects.
makeNPC();