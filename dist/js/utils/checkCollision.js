function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
export function rectangularCollision(_ref) {
  var rectangle1 = _ref.rectangle1,
    rectangle2 = _ref.rectangle2;
  return rectangle1.position.x + rectangle1.width >= rectangle2.position.x && rectangle1.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.position.y + rectangle1.height >= rectangle2.position.y;
}
export function checkForCharacterCollision(_ref2) {
  var characters = _ref2.characters,
    player = _ref2.player,
    _ref2$characterOffset = _ref2.characterOffset,
    characterOffset = _ref2$characterOffset === void 0 ? {
      x: 0,
      y: 0
    } : _ref2$characterOffset;
  // monitor for character collision
  for (var i = 0; i < characters.length; i++) {
    var character = characters[i];
    if (rectangularCollision({
      rectangle1: player,
      rectangle2: _objectSpread(_objectSpread({}, character), {}, {
        position: {
          x: character.position.x + characterOffset.x,
          y: character.position.y + characterOffset.y
        }
      })
    })) {
      console.log('go');
    }
  }
}