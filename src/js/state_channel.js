import { ethers } from 'ethers'
import { startBattleSetting } from '../game/battle/utils'
import { attacked, defensed, renderState } from './battleScene'
import { send } from './network'
import { skills } from './skills'

export const BATTLE_CONTRACT = 'game.web3mon.testnet'
const FT_CONTRACT = 'usdc.web3mon.testnet' // USDC.e contract ID
const BET_AMOUNT = '10000000'
const P1 = 9973
const P2 = 6947

export class Battle {
  data
  wallet
  receiveQueue
  types
  mode

  constructor() {
    this.wallet = ethers.Wallet.createRandom()
    this.receiveQueue = []
    this.data = { status: 'send' }
  }

  // battle offer to opponent
  async offer() {
    var myInfo = { pk: this.wallet.publicKey }
  }

  // accept offered battle from opponent
  async accept() {}

  // start battle (move fund to battle contract)
  async start(battle_id) {
    this.data = { status: 'send' }
    this.mode = 'channel'

    if (battle_id === 'bot')
      var battleInfo = {
        expires_at: Date.now() + 60 * 10 * 1000,
        player_pk: [this.wallet.publicKey, this.wallet.publicKey],
        manager_pk: this.wallet.publicKey,
        players_account: [window.wallet.accountId, 'bot'],
      }
    else
      var battleInfo = await window.wallet.viewMethod({
        contractId: window.collection,
        method: 'get_battle',
        args: { battle_id: battle_id },
      })

    var battleState = {
      battle_id: battle_id,
      expires_at: battleInfo.expires_at,
      sequence: 0,
      player_state: [
        {
          hp: 100,
          lasting_effects: [],
          skills: [],
          atk_turn: false,
        },
        {
          hp: 100,
          lasting_effects: [],
          skills: [],
          atk_turn: false,
        },
      ],
    }

    var my_index

    if (battleInfo.player_pk[0] === this.wallet.publicKey) my_index = 0
    else if (battleInfo.player_pk[1] === this.wallet.publicKey) my_index = 1
    else return false

    if (battleInfo.players_account[my_index] !== window.wallet.accountId)
      return false

    this.data = {
      battleId: battle_id,
      oldBattleState: JSON.parse(JSON.stringify(battleState)),
      battleState: battleState,
      my_index: my_index,
      op_commit: '',
      op_commit_signature: '',
      status: 'send',
      actions: [
        {
          index: 0,
          rand_num: 0,
        },
        {
          index: 0,
          rand_num: 0,
        },
      ],
      manager_signature: '',
      op_pk: battleInfo.player_pk[1 - my_index],
      manager_pk: battleInfo.manager_pk,
      my_sk: this.wallet.privateKey,
    }

    // this.types = await window.wallet.viewMethod({
    //   contractId: window.collection,
    //   method: 'get_types',
    //   args: {},
    // })
    this.skills = skills
    // check for every 1 seconds
    setInterval(() => this.timer(), 1000)

    // moving funds to battle contract
    // await window.wallet.callMethod({
    //   contractId: FT_CONTRACT,
    //   method: 'ft_transfer_call',
    //   args: {
    //     receiver_id: BATTLE_CONTRACT,
    //     amount: BET_AMOUNT,
    //     msg: JSON.stringify({
    //       battle_id: battle_id,
    //       player_index: my_index,
    //     }),
    //   },
    // })
    return true
  }

  chooseAction(action) {
    this.data.actions[this.data.my_index] = {
      index: action,
      rand_num: Math.floor(Math.random() * 1000000000),
    }
    if (this.data.battleId === 'bot')
      if (action < 6)
        this.data.actions[1 - this.data.my_index] = {
          index: 5 - action,
          rand_num: Math.floor(Math.random() * 1000000000),
        }
      else
        this.data.actions[1 - this.data.my_index] = {
          index: action,
          rand_num: Math.floor(Math.random() * 1000000000),
        }
    this.sendCommit()
  }

  isMyAttack() {
    return this.data.battleState.player_state[this.data.my_index].atk_turn
  }

  async endBattle() {
    var player_state = this.data.battleState.player_state
    var my_index = this.data.my_index
    // player win
    if (player_state[my_index].hp !== 0 && player_state[1 - my_index].hp === 0)
      await window.wallet.callMethod({
        contractId: BATTLE_CONTRACT,
        method: 'close_battle',
        args: {
          battle_id: this.data.battleState.battle_id,
        },
      })
  }

  async sendCommit() {
    var commit = await ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(
        JSON.stringify(this.data.actions[this.data.my_index])
      )
    )
    var a = new Uint8Array([this.data.battleState.sequence])
    var b = ethers.utils.arrayify(commit)
    var message = new Uint8Array(a.length + b.length)
    message.set(a)
    message.set(b, a.length)
    var signature = await this.wallet.signMessage(message)
    if (this.mode === 'channel') {
      if (this.data.battleId === 'bot') {
        var commit = await ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(
            JSON.stringify(this.data.actions[1 - this.data.my_index])
          )
        )
        var a = new Uint8Array([this.data.battleState.sequence])
        var b = ethers.utils.arrayify(commit)
        var message = new Uint8Array(a.length + b.length)
        message.set(a)
        message.set(b, a.length)
        var signature = await this.wallet.signMessage(message)
        this.receiveQueue.push(
          JSON.stringify({ commit: commit, signature: signature })
        )
      } else send(JSON.stringify({ commit: commit, signature: signature }))
    } else {
      // send to chain
      await window.wallet.callMethod({
        contractId: BATTLE_CONTRACT,
        method: 'commit',
        args: {
          battle_id: this.data.battleState.battle_id,
          player_index: this.data.my_index,
          commit: commit,
          sig: signature,
        },
      })
    }
    this.data.status = 'commit'
  }

  timer() {
    if (this.mode === 'channel') this.receive()
    else return // TODO
  }

  async receive() {
    if (this.data.status === 'send') return

    // if last consensused state is expired -> this moved to chain
    if (this.data.oldBattleState.expires_at < Date.now()) {
      this.mode = 'chain'
      return
    }
    // console.log(this.data.oldBattleState.expires_at - Date.now())

    var msg = this.receiveQueue.shift()
    if (msg === undefined) return

    console.log(msg)
    if (this.data.status === 'commit') {
      this.data.status = 'send'
      this.receiveCommit(msg)
    } else if (this.data.status === 'reveal') {
      this.data.status = 'send'
      await this.receiveAction(msg)
    } else if (this.data.status === 'state') {
      this.data.status = 'send'
      await this.receiveStateSignature(msg)
    }
  }

  // channel only
  receiveCommit(commit) {
    commit = JSON.parse(commit)
    var signature = commit.signature
    var a = new Uint8Array([this.data.battleState.sequence])
    var b = ethers.utils.arrayify(commit.commit)
    var message = new Uint8Array(a.length + b.length)
    message.set(a)
    message.set(b, a.length)
    var addr = ethers.utils.verifyMessage(message, signature)
    var op_addr = ethers.utils.computeAddress(this.data.op_pk)
    if (addr === op_addr) {
      this.data.op_commit = commit.commit
      this.data.op_commit_signature = signature
      this.sendAction()
      return
    } else {
      return
    }
  }

  async sendAction() {
    var action = this.data.actions[this.data.my_index]
    if (this.mode === 'channel') {
      if (this.data.battleId === 'bot')
        this.receiveQueue.push(
          JSON.stringify(this.data.actions[1 - this.data.my_index])
        )
      else send(JSON.stringify(action))
    } else {
      // send to chain
      await window.wallet.callMethod({
        contractId: BATTLE_CONTRACT,
        method: 'reveal',
        args: {
          battle_id: this.data.battleState.battle_id,
          player_index: this.data.my_index,
          action: action,
        },
      })
    }
    this.data.status = 'reveal'
  }

  // channel only
  async receiveAction(action) {
    action = JSON.parse(action)
    var commit = await ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(action))
    )
    if (commit === this.data.op_commit) {
      this.data.actions[1 - this.data.my_index] = action
      this.sendState()
      return
    } else {
      return
    }
  }

  // channel only
  computeState() {
    var rand_num = this.data.actions[0].rand_num + this.data.actions[1].rand_num

    if (this.data.battleState.sequence === 0) {
      for (var i = 0; i < 2; i++) {
        var action_index = this.data.actions[i].index
        var tmp = -1
        var atk_count = 0
        for (var n = 0; n < 6; n++) {
          var skill_index = action_index % 16
          // 무조건 오름차순
          if (tmp >= skill_index) return false
          action_index = Math.floor(action_index / 16)
          if (this.skills[skill_index].is_atk) atk_count += 1
          this.data.battleState.player_state[i].skills.push(
            JSON.parse(JSON.stringify(this.skills[skill_index]))
          )
          tmp = skill_index
        }
        if (atk_count !== 3) return false
      }
      this.data.battleState.player_state[rand_num % 2].atk_turn = true
    } else {
      var actions = [
        this.data.battleState.player_state[0].skills[
          this.data.actions[0].index
        ],
        this.data.battleState.player_state[1].skills[
          this.data.actions[1].index
        ],
      ]
      for (var i = 0; i < 2; i++) {
        if (
          actions[i].is_atk !== this.data.battleState.player_state[i].atk_turn
        )
          return false
        if (actions[i].remains === 0) return false
        if (actions[i].max_possible_sequence < this.data.battleState.sequence)
          return false
      }

      actions[0].remains -= 1
      actions[1].remains -= 1
      actions[0].stack_left -= 1
      actions[1].stack_left -= 1

      var damage = [0, 0]

      // attack
      for (var i = 0; i < 2; i++) {
        // nullified
        if (
          actions[1 - i].guess_op_action &&
          this.data.actions[i].guess_op_index === this.data.actions[i].index
        )
          continue

        // atk prob
        if ((rand_num % P1) % 100 < actions[i].atk_prob) {
          if (actions[i].atk_is_random) {
            // uniform distribution between 0.5~1.5
            damage[1 - i] = ((rand_num % P1) / P1) * 2 * actions[i].atk
          } else {
            damage[1 - i] = actions[i].atk
          }
          // critical hit
          if (
            actions[i].stack_left == 0 ||
            (rand_num % P1) % 100 < actions[i].critical_prob
          ) {
            damage[1 - i] *= actions[i].critical_mult
            damage[1 - i] += actions[i].critical_add
          }
        }
      }
      console.log(damage)

      // defense
      for (var i = 0; i < 2; i++) {
        // nullified
        if (
          actions[1 - i].guess_op_action &&
          this.data.actions[i].guess_op_index === this.data.actions[i].index
        )
          continue
        // def prob
        if ((rand_num % P1) % 100 < actions[i].def_prob) {
          if (actions[i].def_is_percentage) {
            damage[i] *= (100 - actions[i].def) / 100
          } else {
            damage[i] -= actions[i].def
          }

          // reflection
          if ((rand_num % P2) % 100 < actions[i].reflection_prob) {
            damage[1 - i] += damage[i]
          }
        }
      }
      console.log(damage)

      for (var i = 0; i < 2; i++) {
        if (actions[i].absorb_reflect) {
          var effect = {
            last_for: 1,
            damage: damage[1 - i],
            nullify_action: false,
            prob: 100,
            start_left: 1,
          }
          this.data.battleState.player_state[1 - i].lasting_effects.push(effect)
        }
      }
      console.log(damage)

      // lasting_effects
      for (var i = 0; i < 2; i++) {
        if (actions[i].clear_effects)
          this.data.battleState.player_state[i].lasting_effects = []
        var j = this.data.battleState.player_state[i].lasting_effects.length
        while (j--) {
          var effect = this.data.battleState.player_state[i].lasting_effects[j]
          if (effect.start_left != 0) effect.start_left -= 1
          else {
            if ((rand_num % P1) % 100 < effect.prob) damage[i] += effect.damage
            effect.last_for -= 1
          }
          if (effect.last)
            this.data.battleState.player_state[i].lasting_effects.splice(j, 1)
        }
      }
      console.log(damage)

      // add lasting effects
      for (var i = 0; i < 2; i++) {
        if (actions[i].lasting_to_me !== undefined)
          this.data.battleState.player_state[i].lasting_effects.push(
            actions[i].lasting_to_me
          )

        if (actions[i].lasting_to_op !== undefined)
          this.data.battleState.player_state[1 - i].lasting_effects.push(
            actions[i].lasting_to_op
          )
      }
      for (var i = 0; i < 2; i++) {
        this.data.battleState.player_state[i].hp -= damage[i]
      }
    }
    return true
  }

  // channel only
  async sendState() {
    if (!this.computeState()) {
      console.log('problem computing state')
      return false
    }
    var message = await ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(this.data.battleState))
    )
    var signature = await this.wallet.signMessage(message)
    if (this.data.battleId === 'bot')
      this.receiveQueue.push(
        JSON.stringify({
          signature: signature,
          expires_at: Date.now() + 150 * 1000,
        })
      )
    else send(signature)
    this.data.status = 'state'
  }

  // chain only (query chain to get battle)
  async getBattle() {
    var res = await window.wallet.viewMethod({
      contractId: window.collection,
      method: 'get_battle',
      args: { battle_id: this.data.battleId },
    })
    this.data.battleState = res.battle_state
    // TODO
  }

  // channel only
  async receiveStateSignature(msg) {
    msg = JSON.parse(msg)
    var signature = msg.signature
    var expires_at = msg.expires_at

    // next state is valid only until 2.5 minute from now
    if (!(expires_at < Date.now() + 150 * 1000)) return
    var message = await ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(this.data.battleState))
    )
    var addr = ethers.utils.verifyMessage(message, signature)
    var manager_addr = ethers.utils.computeAddress(this.data.op_pk)
    if (addr === manager_addr) {
      this.data.manager_signature = signature
      this.data.oldBattleState = JSON.parse(
        JSON.stringify(this.data.battleState)
      )
      this.data.battleState.expires_at = expires_at
      for (var i = 0; i < 2; i++) {
        this.data.battleState.player_state[i].atk_turn =
          !this.data.battleState.player_state[i].atk_turn
      }
      this.data.status = 'commit'
      if (this.data.battleState.sequence === 0) startBattleSetting(250)
      else renderState(this.data)

      this.data.battleState.sequence += 1
      return true
    } else {
      return false
    }
  }
}
