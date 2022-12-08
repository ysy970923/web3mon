function player_init(battle_id, pk) {
  // TODO: player send money with battle_id and pk
}

let battle_state = {
  battle_id: 0,
  expires_at: 0,
  sequence: 1,
  attacker_id: 0,
  player_state: [
    {
      attacks: [
        { atk: 10, remains: 255, critical_prob: 30 },
        { atk: 20, remains: 3, critical_prob: 0 },
        { atk: 15, remains: 1, critical_prob: 30 },
      ],
      defenses: [
        { def: 1, remains: 255, reflection_prob: 0 },
        { def: 2, remains: 3, reflection_prob: 0 },
        { def: 0, remains: 1, reflection_prob: 100 },
      ],
      hp: 50,
    },
    {
      attacks: [
        { atk: 10, remains: 255, critical_prob: 30 },
        { atk: 20, remains: 3, critical_prob: 0 },
        { atk: 15, remains: 1, critical_prob: 30 },
      ],
      defenses: [
        { def: 1, remains: 255, reflection_prob: 0 },
        { def: 2, remains: 3, reflection_prob: 0 },
        { def: 0, remains: 1, reflection_prob: 100 },
      ],
      hp: 50,
    },
  ],
}

let battle_action = {
  action: 0,
  rand_num: 0,
}

let tmp_wallet = ethers.Wallet.createRandom()

let channel_state = {
  battle_state: battle_state,
  new_battle_state: battle_state,
  op_commit: '',
  op_commit_signature: '',
  my_action: '',
  op_action: '',
  manager_signature: '',
  op_pk: '',
  manager_pk: '',
  my_sk: tmp_wallet.privateKey,
}

send_commit(0, battle_action, 'channel')

async function send_commit(sequence, action, mode) {
  var commit = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(action))
  )
  var a = new Uint8Array([sequence])
  var b = ethers.utils.arrayify(commit)
  var message = new Uint8Array(a.length + b.length)
  message.set(a)
  message.set(b, a.length)
  var signature = await tmp_wallet.signMessage(message)
  if (mode === 'channel') {
    // send to server
    // sendMsgToServer(TypeToNum['send-commit'], commit);
    receive_commit(sequence, commit, signature, tmp_wallet.address)
  } else if (mode === 'chain') {
    // send to chain
  }
}

// 'channel' mode
// assert signature == sign(commit, pk)
async function receive_commit(sequence, commit, signature, op_pk) {
  if (Date.now() > channel_state.battle_state.expires_at + 40) return false
  var a = new Uint8Array([sequence])
  var b = ethers.utils.arrayify(commit)
  var message = new Uint8Array(a.length + b.length)
  message.set(a)
  message.set(b, a.length)
  var addr = ethers.utils.verifyMessage(message, signature)
  var op_addr = ethers.utils.computeAddress(op_pk)
  if (addr === op_addr) {
    channel_state.op_commit = commit
    channel_state.op_commit_signature = signature
    return true
  } else {
    return false
  }
}

async function send_action(action, mode) {
  if (mode === 'channel') {
    // send to server
  } else if (mode === 'chain') {
    // send to chain
  }
}

// 'channel' mode
// assert H(reveal) == commit
async function receive_action(commit, action) {
  if (Date.now() > channel_state.battle_state.expires_at + 50) return false
  var commit = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(action))
  )
  if (commit === channel_state.op_commit) {
    channel_state.op_action = action
    return true
  } else {
    return false
  }
}

// 'channel' mode
async function compute_and_send_state(old_state, my_action, op_action) {
  // compute state
  var message = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(channel_state.new_battle_state))
  )
  var signature = await tmp_wallet.signMessage(message)
  if (mode === 'channel') {
    // send to server
    // sendMsgToServer(TypeToNum['send-commit'], commit);
    receive_state(sequence, commit, signature, tmp_wallet.address)
  }
}

function compute_state() {
  channel_state.new_battle_state.expires_at += 60000
  var rand_num =
    channel_state.my_action.rand_num + channel_state.op_action.rand_num
}

/**
 *
 * @param {*} signature
 * @param {*} manager_pk
 * @returns
 * 'channel' mode
 * assert manager_sig == sign(state, manager_pk)
 */
async function receive_state_signature(signature, manager_pk) {
  if (Date.now() > channel_state.battle_state.expires_at + 60) return false
  var message = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(channel_state.new_battle_state))
  )
  var addr = ethers.utils.verifyMessage(message, signature)
  var manager_addr = ethers.utils.computeAddress(manager_pk)
  if (addr === manager_addr) {
    channel_state.battle_state = channel_state.new_battle_state
    return true
  } else {
    return false
  }
}

async function read_state_from_chain() {}
