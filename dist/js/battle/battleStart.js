import { others } from '../../js/network';
import { canvas, battle, stopAllPlay } from '../../js/index';
import { offerBattle } from './acceptBattleBtn';
import { player } from '../../js/index';
import { clickOutSideProfileEvent } from '../../web/clickButtons';

/**
 * check whether click another player to battle.
 */
export function clickEvent() {
  canvas.addEventListener('click', function (e) {
    // need to be ready and not currently battling and in BATTLE map
    // if (!battle.ready || battle.initiated || player.map === 'MAIN') return
    if (!battle.ready || battle.initiated) return;
    if (stopAllPlay) return;
    for (var key in others) {
      var x = e.offsetX - others[key].sprite.width / 2;
      var y = e.offsetY - others[key].sprite.height / 2;

      // 상대방을 클릭한지에 대한 체크
      if (Math.abs(others[key].sprite.position.x - x) < others[key].sprite.width / 2 && Math.abs(others[key].sprite.position.y - y) < others[key].sprite.height / 2) {
        clickToStartBattle(key);
        break;
      }
    }
  });
}

/**
 * when clicked another player to battle.
 * @param {string} key
 */
var clickToStartBattle = function clickToStartBattle(key) {
  // show battle request popup
  displayBattleAcceptPopup(key);

  // 배틀 제안
  offerBattle(key, true);

  // 배틀 제안 취소
  document.getElementById('refuseBattleBtn').addEventListener('click', function (e) {
    document.getElementById('acceptBattleCard').style.display = 'none';
  });
  document.getElementById('seeOpponentInfo').addEventListener('click', function (e) {
    document.getElementById('acceptBattleCard').style.display = 'none';
    document.getElementById('profileCard').style.display = 'block';
    document.body.addEventListener('click', function (e) {
      clickOutSideProfileEvent(e);
    }, true);
  });
};

/**
 * 지금 클릭한 애랑 배틀 할거야? or 얘가 너랑 싸우고 싶다는데 배틀할거야? 보여주기
 * @param {string} key 상대방의 아이디
 */
export var displayBattleAcceptPopup = function displayBattleAcceptPopup(key) {
  document.getElementById('acceptBattleBtn').style.display = 'inline-block';
  document.getElementById('refuseBattleBtn').style.display = 'inline-block';
  document.getElementById('acceptBattleBtn').replaceWith(document.getElementById('acceptBattleBtn').cloneNode(true));
  document.getElementById('refuseBattleBtn').replaceWith(document.getElementById('refuseBattleBtn').cloneNode(true));
  document.getElementById('acceptBattleCard').style.display = 'block';
  document.getElementById('battleOpponentName2').innerText = 'Opponent: ' + others[key].sprite.name;
};