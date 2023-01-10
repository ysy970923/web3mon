function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var chatBubble = new Image();
chatBubble.src = 'img/chatBubble2.png';
export var terraLogo = new Image();
terraLogo.src = 'img/terra.png';
export var nearLogo = new Image();
nearLogo.src = 'img/near.png';
import { canva } from '../../js/index';
export var Sprite = /*#__PURE__*/function () {
  function Sprite(_ref) {
    var _this = this;
    var position = _ref.position,
      image = _ref.image,
      _ref$frames = _ref.frames,
      frames = _ref$frames === void 0 ? {
        max: 1,
        hold: 10
      } : _ref$frames,
      sprites = _ref.sprites,
      _ref$animate = _ref.animate,
      animate = _ref$animate === void 0 ? false : _ref$animate,
      _ref$rotation = _ref.rotation,
      rotation = _ref$rotation === void 0 ? 0 : _ref$rotation,
      _ref$scale = _ref.scale,
      scale = _ref$scale === void 0 ? 1 : _ref$scale,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? '' : _ref$name,
      _ref$baseImage = _ref.baseImage,
      baseImage = _ref$baseImage === void 0 ? '' : _ref$baseImage,
      _ref$map = _ref.map,
      map = _ref$map === void 0 ? 'MAIN' : _ref$map,
      _ref$nftName = _ref.nftName,
      nftName = _ref$nftName === void 0 ? '' : _ref$nftName,
      _ref$myCharacter = _ref.myCharacter,
      myCharacter = _ref$myCharacter === void 0 ? false : _ref$myCharacter;
    _classCallCheck(this, Sprite);
    this.map = map;
    this.relative_position = {
      x: 0,
      y: 0
    };
    this.position = position;
    this.image = new Image();
    this.frames = _objectSpread(_objectSpread({}, frames), {}, {
      val: 0,
      elapsed: 0
    });
    this.image.onload = function () {
      _this.width = _this.image.width / _this.frames.max * scale;
      _this.height = _this.image.height * scale;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.scale = scale;
    this.name = name;
    this.chat = '';
    this.chatShowTime = 0;
    this.baseImage = baseImage;
    this.nftName = nftName;
    this.myCharacter = myCharacter;
  }
  _createClass(Sprite, [{
    key: "draw",
    value: function draw() {
      canva.save();
      canva.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
      canva.rotate(this.rotation);
      canva.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
      canva.globalAlpha = this.opacity;
      var crop = {
        position: {
          x: this.frames.val * this.width,
          y: 0
        },
        width: this.image.width / this.frames.max,
        height: this.image.height
      };
      var image = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        width: this.image.width / this.frames.max,
        height: this.image.height
      };
      if (this.name.length > 0) {
        canva.font = '10px "Press Start 2P"';
        var textWidth = canva.measureText(this.name).width;
        canva.fillText(this.name, image.position.x + image.width / 2 - textWidth / 2, image.position.y - 5);
        // draw logo
        if (this.nftName) {
          if (this.nftName === 'terra') {
            canva.drawImage(terraLogo, image.position.x + image.width / 2 - 5, image.position.y - 36, 17, 17);
          } else if (this.nftName === 'Npunks') {
            canva.drawImage(nearLogo, image.position.x + image.width / 2 - 5, image.position.y - 36, 17, 17);
          }
        }
        if (this.myCharacter) {
          // canva.drawImage(
          //   nearLogo,
          //   image.position.x + image.width / 2 - 5,
          //   image.position.y + image.height / 2 + 50,
          //   17,
          //   17
          // )
        }
      }
      if (this.chat.length > 0) {
        this.chatShowTime += 1;
        canva.drawImage(chatBubble, image.position.x + 40, image.position.y - 70, 150, 80);
        canva.fillText(this.chat, image.position.x + 55, image.position.y - 39);
        if (this.chatShowTime > 600) {
          this.chatShowTime = 0;
          this.chat = '';
        }
      }
      canva.drawImage(this.image, crop.position.x, crop.position.y, crop.width, crop.height, image.position.x, image.position.y, image.width * this.scale, image.height * this.scale);
      canva.restore();
      if (!this.animate) return;
      if (this.frames.max > 1) {
        this.frames.elapsed++;
      }
      if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++;else this.frames.val = 0;
      }
    }
  }]);
  return Sprite;
}();