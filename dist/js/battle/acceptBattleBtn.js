import { setOpponentId } from '../../js/battleScene';
import { setMySkillType, startBattleSetting } from './utils';
import { checkOrReconnect } from '../../game/network/checkConnection';
import { ws } from '../../js/network';
import { npc_list } from '../data/npc';

/**
 *
 * 진짜 배틀 제안(Yes 클릭)
 * @param {string} opponentId 상대방 아이디(나한테 배틀을 건)
 * @param {boolean} isMyRequest
 * @param {string} battleId 서버에서 내려받은 배틀아이디
 */
export function offerBattle(opponentId, isMyRequest, battleId) {
  document.getElementById('acceptBattleBtn').addEventListener('click', function (e) {
    document.getElementById('refuseBattleBtn').style.display = 'none';
    document.getElementById('selectTypeCard').style.display = 'block';
    if (npc_list.contains(opponentId)) {
      // NPC면
      console.log('NPC 예스', opponentId);
      setOpponentId(opponentId);
      document.getElementById('selectTypeBtn').addEventListener('click', function (e) {
        startBattleSetting(250, true, '');
      });
    } else {
      document.getElementById('selectTypeBtn').addEventListener('click', function (e) {
        document.getElementById('selectTypeCard').style.display = 'none';
        document.getElementById('battleOpponentName2').innerText = 'Waiting for acceptance...';
        document.getElementById('acceptBattleBtn').style.display = 'none';
        // 내 스킬타입 확정
        setMySkillType(document.getElementById('selectType').value);

        // NPC가 아니면 상대방과 악수하는 과정이 필요

        // Request if I made this battle.
        if (isMyRequest)
          // request battle
          requestBattle(opponentId, document.getElementById('selectType').value);
          // Accept if opponent made this battle
          // accept battle
        else sendAcceptBattleRequest(opponentId, document.getElementById('selectType').value, battleId);
      });
    }
  });
}
export function sendAcceptBattleRequest(proposer_player_id, skillType, battle_id) {
  if (!checkOrReconnect()) return;
  var body = {
    BattleAccept: {
      battle_id: battle_id,
      battle_pub_key: ''
    }
  };
  console.log('바디', body);
  var msg = JSON.stringify(body);
  ws.send(msg);
}
export function rejectBattle(proposer_player_id, battle_id) {
  document.getElementById('refuseBattleBtn').addEventListener('click', function (e) {
    if (!checkOrReconnect()) return;
    var body = {
      RejectBattle: {
        proposer_player_id: proposer_player_id,
        battle_id: parseInt(battle_id)
      }
    };
    console.log(JSON.stringify(body), ' 제이썬');
    // ws.send(JSON.stringify(body))
  });
}

/**
 * 스킬 타입이 있긴한데.. 처음에는 요청을 안보내지?
 */
export function requestBattle(receiver_player_id, skillType) {
  if (!checkOrReconnect()) return;
  console.log('이사람한테 보낸다22222', receiver_player_id, skillType);
  var body = {
    BattlePropose: {
      receiver_player_id: receiver_player_id,
      battle_pub_key: ''
    }
  };
  var msg = JSON.stringify(body);
  ws.send(msg);
}