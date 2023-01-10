function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import { Sprite } from './Sprite';
import { gsap } from 'gsap';
import { my_turn } from '../battle/utils';
import { MonsterSkillType } from './objectType';
var larvaImage = new Image();
larvaImage.src = '../../../img/draggleSprite.png';
var fireballImage = new Image();
fireballImage.src = '../../../img/fireball.png';
export var Monster = /*#__PURE__*/function (_Sprite) {
  _inherits(Monster, _Sprite);
  var _super = _createSuper(Monster);
  function Monster(_ref) {
    var _this;
    var image = _ref.image,
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
      name = _ref.name,
      health = _ref.health,
      isEnemy = _ref.isEnemy,
      attacks = _ref.attacks;
    _classCallCheck(this, Monster);
    var position;
    if (isEnemy) position = {
      x: 650,
      y: 100
    };else position = {
      x: 250,
      y: 305
    };
    _this = _super.call(this, {
      position: position,
      image: image,
      frames: frames,
      sprites: sprites,
      animate: animate,
      rotation: rotation,
      name: name
    });
    _this.initialHealth = health;
    _this.health = health;
    _this.isEnemy = isEnemy;
    _this.attacks = attacks;
    return _this;
  }
  _createClass(Monster, [{
    key: "faint",
    value: function faint() {
      document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!';
      gsap.to(this.position, {
        y: this.position.y + 20
      });
      gsap.to(this, {
        opacity: 0
      });
    }

    /** 공격 : 공격의 종류, 공격 받는 사람, 배틀에 참여중인 sprites */
  }, {
    key: "attack",
    value: function attack(_ref2) {
      var _attack = _ref2.attack,
        recipient = _ref2.recipient,
        renderedSprites = _ref2.renderedSprites;
      document.querySelector('#dialogueBox').style.display = 'block';
      document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + _attack.name;
      setTimeout(function () {
        if (my_turn) document.querySelector('#dialogueBox').style.display = 'none';
      }, 2000);
      var healthBar = '#enemyHealthBar';
      if (this.isEnemy) healthBar = '#playerHealthBar';
      var rotation = 1;
      if (this.isEnemy) rotation = -2.2;
      recipient.health -= _attack.atk;
      switch (_attack.effect) {
        case MonsterSkillType.FIREBALL:
          var fireball = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: fireballImage,
            frames: {
              max: 4,
              hold: 10
            },
            animate: true,
            rotation: rotation,
            name: MonsterSkillType.FIREBALL
          });
          renderedSprites.splice(1, 0, fireball);
          gsap.to(fireball.position, attackGaspAnimation(healthBar, renderedSprites, recipient));
          break;
        case MonsterSkillType.LARVA:
          var larva = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: larvaImage,
            frames: {
              max: 4,
              hold: 10
            },
            animate: true,
            rotation: rotation,
            name: MonsterSkillType.LARVA
          });
          renderedSprites.splice(1, 0, larva);
          gsap.to(larva.position, attackGaspAnimation(healthBar, renderedSprites, recipient));
          break;
        case MonsterSkillType.TACKLE:
          var tl = gsap.timeline();
          var movementDistance = 20;
          if (this.isEnemy) movementDistance = -20;
          tl.to(this.position, {
            x: this.position.x - movementDistance
          }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: function onComplete() {
              // Enemy actually gets hit
              gsap.to(healthBar, {
                width: 100 * recipient.health / recipient.initialHealth + '%'
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08
              });
            }
          }).to(this.position, {
            x: this.position.x
          });
          break;
      }
    }
  }]);
  return Monster;
}(Sprite);
var attackGaspAnimation = function attackGaspAnimation(healthBar, renderedSprites, recipient) {
  return {
    x: recipient.position.x,
    y: recipient.position.y,
    onComplete: function onComplete() {
      // Enemy actually gets hit
      gsap.to(healthBar, {
        width: 100 * recipient.health / recipient.initialHealth + '%'
      });
      gsap.to(recipient.position, {
        x: recipient.position.x + 10,
        yoyo: true,
        repeat: 5,
        duration: 0.08
      });
      gsap.to(recipient, {
        opacity: 0,
        repeat: 5,
        yoyo: true,
        duration: 0.08
      });
      renderedSprites.splice(1, 1);
    }
  };
};