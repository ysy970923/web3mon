import { animate } from '../game/animate';
import { Sprite } from '../game/object/Sprite';
import { others, attack } from './network';
import { skillTypes } from '../game/battle/utils/skillSets';
import { player, canva, battle } from './index';
import { Monster } from '../game/object/Monster';
import { gsap } from 'gsap';
import { battleAnimationId } from '../game/battle/utils/enterBattle';
import { mySkillType, setBattleStart, my_turn, setMyTurn } from '../game/battle/utils';
import { clickSkillButton } from '../game/battle/attack';
import { playerUrl } from '../web/logIn';
var battleBackgroundImage = new Image();
battleBackgroundImage.src = '../img/battleBackground2.png';
export var battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage,
  scale: 1.2
});
export var opponent_id = null;
export var opponent;
export var myMonster;
export var renderedSprites;
export var queue;

/** 공격이 들어와서 내가 공격을 받음 */
export function attacked(attack) {
  queue.push(function () {
    opponent.attack({
      attack: opponent.attacks[attack],
      recipient: myMonster,
      renderedSprites: renderedSprites
    });
    setMyTurn(true);
    if (myMonster.health <= 0) {
      queue.push(function () {
        myMonster.faint();
      });
      endBattle('LOSE');
    }
  });
}

/**
 *
 * @param {'win' | 'lose'} result 이겼으면 win, 졌으면 lose
 */
export function endBattle(result) {
  if (result === 'win') {
    console.log('이겼다.');
  } else if (result === 'lose') {
    console.log('졌다.');
  }
  queue.push(function () {
    // fade back to black
    gsap.to('#overlappingDiv', {
      opacity: 1,
      onComplete: function onComplete() {
        cancelAnimationFrame(battleAnimationId);
        animate();
        document.querySelector('#userInterface').style.display = 'none';
        document.getElementById('battleResultCard').style.display = 'block';
        document.getElementById('battleResult').innerText = "You ".concat(result, "!");
        document.querySelector('#joyDiv').style.display = 'block';
        gsap.to('#overlappingDiv', {
          opacity: 0
        });
        battle.initiated = false;
      }
    });
    setBattleStart(false);
  });
}

/**
 * 진짜 배틀 시작, 배틀 맵으로 이동
 */
export function initBattle() {
  canva.width = window.innerWidth;
  canva.height = window.innerHeight;
  document.querySelector('#joyDiv').style.display = 'none';
  document.querySelector('#userInterface').style.display = 'block';
  document.querySelector('#dialogueBox').style.display = 'none';
  document.querySelector('#enemyHealthBar').style.width = '100%';
  document.querySelector('#playerHealthBar').style.width = '100%';
  document.querySelector('#attacksBox').replaceChildren();
  document.querySelector('#battleMyName').innerHTML = "me(".concat(player.name, ")");
  document.querySelector('#battleOpponentName').innerHTML = "opponent(".concat(others[opponent_id].sprite.name, ")");
  if (!my_turn) {
    document.querySelector('#dialogueBox').style.display = 'block';
    document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn';
  }
  var opponentUser = {
    image: others[opponent_id].baseImage,
    isEnemy: true,
    name: others[opponent_id].sprite.name,
    health: skillTypes[others[opponent_id].skillType].health,
    attacks: JSON.parse(JSON.stringify(skillTypes[others[opponent_id].skillType].atk)),
    defenses: skillTypes[others[opponent_id].skillType].def
  };
  opponent = new Monster(opponentUser);
  var myCharacter = {
    image: player.baseImage,
    isEnemy: false,
    name: player.name,
    health: skillTypes[mySkillType].health,
    attacks: JSON.parse(JSON.stringify(skillTypes[mySkillType].atk)),
    defenses: skillTypes[mySkillType].def
  };
  myMonster = new Monster(myCharacter);
  renderedSprites = [opponent, myMonster];
  queue = [];
  enterImageAnimation();
  document.querySelector('#attacksBox').style['grid-template-columns'] = "repeat(".concat(myMonster.attacks.length, ", 1fr)");
  myMonster.attacks.forEach(function (attack, index) {
    var button = document.createElement('button');
    button.id = "skill_button_".concat(index, "th");
    button.innerHTML = insertButton(attack);
    button.value = attack.value;
    document.querySelector('#attacksBox').append(button);
  });

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function (e) {
      clickSkillButton(e.currentTarget.value);
    });
  });
}
document.querySelector('#dialogueBox').addEventListener('click', function (e) {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn';
});
export function setOpponentId(id) {
  opponent_id = id;
}
var enterImageAnimation = function enterImageAnimation() {
  document.getElementById('enter_img').src = playerUrl;
  document.getElementById('enter_collection').innerText = player.name;
  document.getElementById('enter_name').innerText = player.name;
  document.getElementById('enter_exterior').innerText = player.name;
  document.getElementById('enter_atk').innerText = "".concat(skillTypes[mySkillType].attack, " atk");
  document.getElementById('enter_def').innerText = "".concat(skillTypes[mySkillType].attack, " def");
  document.getElementById('enter_health').innerText = "".concat(skillTypes[mySkillType].health, " health");
  console.log('열리는 실행');
  document.querySelector('#battle_enter').style.transition = 'all 0s ease-out';
  document.querySelector('#battle_enter').style.opacity = 1;
  document.querySelector('#battle_enter').style.zIndex = 1000;
  setTimeout(function () {
    console.log('닫히는게 실행');
    document.querySelector('#battle_enter').style.transition = 'all 1.2s ease-out';
    document.querySelector('#battle_enter').style.opacity = 0;
    document.querySelector('#battle_enter').style.zIndex = -5;
  }, 5000);
};
export function insertButton(atk) {
  console.log('공격', atk);
  var buttonDesc = "<div class=\"skill_button_desc\">\n      <div class=\"skill_desc\">\n        <p class=\"skill_name\">".concat(atk.name, "</p><p>atk: ").concat(atk.atk, "<br>cool: ").concat(atk.left_cool_time, "<br>left: ").concat(atk.limit, "</p></p>\n      </div>\n    </div>");
  if (atk.name === 'Fireball') return "<div class=\"game_skill_btn\">\n          <img src=\"../../img/battle/fireball_icon.png\" style=\"height: 90px; object-fit: contain;\">\n          ".concat(buttonDesc, "\n        </div>");else if (atk.name === 'Lightning') return "<div class=\"game_skill_btn\"><img src=\"../../img/battle/lightning_icon.jpg\" style=\"height: 90px; object-fit: contain;\">\n          ".concat(buttonDesc, "\n      </div>");else return "<div class=\"game_skill_btn\"><img src=\"../../img/battle/punch_icon.png\" style=\"height: 90px; object-fit: contain;\">\n          ".concat(buttonDesc, "\n      </div>");
}