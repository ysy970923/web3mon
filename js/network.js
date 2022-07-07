var ws = null
var myID = null
var peerConnection = null
var webcamStream = null
var targetID = null
var others = {}
var transceiver = null // RTCRtpTransceiver
var battle_start = false

var mediaConstraints = {
  audio: true,
  video: {
    aspectRatio: {
      ideal: 1.333333
    }
  }
}

//0 ~ 9: binary; 10 ~: JSON string
var NumToType = {
  0: 'id',
  1: 'update-user-list',
  2: 'move-user',
  3: 'battle-offer',
  4: 'battle-answer',
  5: 'attack',

  10: 'video-offer',
  11: 'video-answer',
  12: 'new-ice-candidate',
  13: 'hang-up'
}

var reverseMapping = (o) =>
  Object.keys(o).reduce(
    (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }),
    {}
  )

var TypeToNum = reverseMapping(NumToType)

function moveUser(pos, rot) {
  if (!ws) return
  var buffer = new ArrayBuffer(9)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['move-user'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, Number.parseInt(pos.x))
  dataview.setInt16(5, Number.parseInt(pos.y))
  dataview.setInt16(7, Number.parseInt(rot))
  ws.send(buffer)
}

function battleOffer(id) {
  if (!ws) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['battle-offer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function battleAnswer(id) {
  if (!ws) return
  if (!ws) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['battle-answer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function attack(id, attack) {
  if (!ws) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['attack'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, attack)
  ws.send(buffer)
  my_turn = false
}

// if type >= 10: data should be dict
function sendMsgToServer(type, msg) {
  if (!ws) return
  var typeNum = TypeToNum[type]

  var buffer1 = new ArrayBuffer(1)
  var dataview = new DataView(buffer1)
  dataview.setInt8(0, typeNum)

  var msgJSON = JSON.stringify(msg)
  log('Send to server: ' + msgJSON)
  var encoder = new TextEncoder()
  var buffer2 = encoder.encode(msgJSON).buffer

  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  tmp.set(new Uint8Array(buffer1), 0)
  tmp.set(new Uint8Array(buffer2), 1)
  ws.send(tmp.buffer)
}

function getDictFromBinary(data) {
  var buf = new Uint8Array(data).slice(1)

  var decoder = new TextDecoder()
  var msg = JSON.parse(decoder.decode(buf))
  return msg
}

function tryInvite(id) {
  if (!peerConnection) invite(id)
}

async function invite(id) {
  if (peerConnection) {
    alert("You can't start a call because you already have one open!")
  } else {
    targetID = id
    log(`Inviting user ${targetID}`)
    createPeerConnection()

    try {
      webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      document.getElementById('local_video').srcObject = webcamStream
    } catch (err) {
      handleGetUserMediaError(err)
      return
    }
    try {
      webcamStream.getTracks().forEach(
        (transceiver = (track) => {
          console.log(track)
          peerConnection.addTransceiver(track, { streams: [webcamStream] })
        })
      )
    } catch (err) {
      handleGetUserMediaError(err)
    }
  }
}

function closeVideoCall() {
  var localVideo = document.getElementById('local_video')

  log('Closing the call')

  if (peerConnection) {
    log('---> Closing the peer connection')

    peerConnection.ontrack = null
    peerConnection.onnicecandidate = null
    peerConnection.oniceconnectionstatechange = null
    peerConnection.onsignalingstatechange = null
    peerConnection.onicegatheringstatechange = null
    peerConnection.onnotificationneeded = null

    peerConnection.getTransceivers().forEach((transceiver) => {
      transceiver.stop()
    })

    if (localVideo.srcObject) {
      localVideo.pause()
      localVideo.srcObject.getTracks().forEach((track) => {
        track.stop()
      })
    }
    peerConnection.close()
    peerConnection = null
    webcamStream = null
  }
  targetID = null
}

function handleUserlistMsg() {
  for (var [key, value] of Object.entries(others)) {
    value.invite = () => invite(key)
  }
}

function handleICECandidateEvent(event) {
  if (event.candidate) {
    log('*** Outgoing ICE candidate: ' + event.candidate.candidate)

    sendMsgToServer('new-ice-candidate', {
      target: targetID,
      candidate: event.candidate
    })
  }
}

function handleICEConnectionStateChangeEvent(event) {
  log('*** ICE connection state change to ' + peerConnection.iceConnectionState)

  switch (peerConnection.iceConnectionState) {
    case 'closed':
    case 'failed':
    case 'disconnected':
      closeVideoCall()
      break
  }
}

function handleICEGatheringStateChangeEvent(event) {
  log('*** ICE gathering state changed to: ' + peerConnection.iceGatheringState)
}

function handleSignalingStateChangeEvent(event) {
  log('*** WebRTC signaling state changed to: ' + peerConnection.signalingState)
  switch (peerConnection.signalingState) {
    case 'closed':
      closeVideoCall()
      break
  }
}

async function handleNegotiationNeededEvent() {
  log('*** Negotiation needed')

  try {
    log('---> Creating offer')
    var offer = await peerConnection.createOffer()

    if (peerConnection.signalingState != 'stable') {
      log('connection not stable; postponing')
      return
    }

    log('---> Setting local description to the offer')
    await peerConnection.setLocalDescription(offer)

    log('---> Sending the offer to the remote peer')
    sendMsgToServer('video-offer', {
      id: myID,
      target: targetID,
      sdp: peerConnection.localDescription
    })
  } catch (err) {
    log(
      '*** The following error occurred while handling the negotiationneeded event:'
    )
    reportError(err)
  }
}

function handleTrackEvent(event) {
  log('*** Track event')
  log(event.streams[0])
  document.getElementById('received_video').srcObject = event.streams[0]
  document.getElementById('hangup-button').disabled = false
}

function handleGetUserMediaError(e) {
  log_error(e)
  switch (e.name) {
    case 'NotFoundError':
      alert(
        'Unable to open your call because no camera and/or microphone' +
          'were found.'
      )
      break
    case 'SecurityError':
    case 'PermissionDeniedError':
      // Do nothing; this is the same as the user canceling the call.
      break
    default:
      alert('Error opening your camera and/or microphone: ' + e.message)
      break
  }

  closeVideoCall()
}

async function createPeerConnection() {
  log('Setting up a connection...')

  peerConnection = new RTCPeerConnection({
    iceServers: [
      // Information about ICE servers - Use your own!
      { urls: 'stun:stun4.l.google.com:19302' }
      // {
      //     urls: "turn:yusangyoon.com",  // A TURN server
      //     username: "webrtc",
      //     credential: "turnserver"
      // }
    ]
  })

  peerConnection.onicecandidate = handleICECandidateEvent
  peerConnection.oniceconnectionstatechange =
    handleICEConnectionStateChangeEvent
  peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent
  peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent
  peerConnection.onnegotiationneeded = handleNegotiationNeededEvent
  peerConnection.ontrack = handleTrackEvent
}

async function handleVideoOfferMsg(msg) {
  targetID = msg.id

  log('Received video chat offer from ' + targetID)
  if (!peerConnection) {
    createPeerConnection()
  }

  var desc = new RTCSessionDescription(msg.sdp)

  if (peerConnection.signalingState != 'stable') {
    log("--> But the signaling state isn't stable, so triggering rollback")

    await Promise.all([
      peerConnection.setLocalDescription({ type: 'rollback' }),
      peerConnection.setRemoteDescription(desc)
    ])
    return
  } else {
    log('--> Setting remote description')
    await peerConnection.setRemoteDescription(desc)
  }

  if (!webcamStream) {
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    } catch (err) {
      handleGetUserMediaError(err)
      return
    }

    document.getElementById('local_video').srcObject = webcamStream

    try {
      webcamStream
        .getTracks()
        .forEach(
          (transceiver = (track) =>
            peerConnection.addTransceiver(track, { streams: [webcamStream] }))
        )
    } catch (err) {
      handleGetUserMediaError(err)
    }
  }
  log('---> Creating and sending answer to caller')

  await peerConnection.setLocalDescription(await peerConnection.createAnswer())

  sendMsgToServer('video-answer', {
    id: myID,
    target: targetID,
    sdp: peerConnection.localDescription
  })
}

async function handleVideoAnswerMsg(msg) {
  log('*** Call recipient has accepted our call')

  var desc = new RTCSessionDescription(msg.sdp)
  await peerConnection.setRemoteDescription(desc).catch(reportError)
}

async function handleNewICECandidateMsg(msg) {
  var candidate = new RTCIceCandidate(msg.candidate)

  log('*** Adding received ICE candidate: ' + JSON.stringify(candidate))

  try {
    await peerConnection.addIceCandidate(candidate)
  } catch (err) {
    reportError(err)
  }
}

function handleHangUpMsg(msg) {
  log('*** Received hang up notification from other peer')

  closeVideoCall()
}

function onmessage(data) {
  var buf = new Uint8Array(data).buffer
  var dv = new DataView(buf)
  var msg = null

  var type = NumToType[dv.getInt8(0)]

  switch (type) {
    case 'id': // my id is given
      myID = dv.getInt16(1)
      log('My ID: ' + myID)
      break

    case 'update-user-list': // user list change
      msg = getDictFromBinary(data)

      Object.keys(others).forEach((id) => {
        if (!(id in msg['user-list'])) delete others[id]
      })

      msg['user-list'].forEach((id) => {
        if (!(id in others || id == myID)) {
          others[id] = new Sprite({
            position: {
              x: canvas.width / 2 - 192 / 4 / 2 + 100,
              y: canvas.height / 2 - 68 / 2 + 100
            },
            image: playerDownImage,
            frames: {
              max: 4,
              hold: 10
            },
            sprites: {
              up: playerUpImage,
              left: playerLeftImage,
              right: playerRightImage,
              down: playerDownImage
            }
          })
          // if (!peerConnection)
          //     invite(id);
        }
      })
      break

    case 'move-user': // other user move
      var id = dv.getInt16(1)
      others[id].position = local_position({
        x: dv.getInt16(3),
        y: dv.getInt16(5)
      })
      const rotation = dv.getInt16(7)
      switch (rotation) {
        case 0:
          others[id].image = playerUpImage
          break
        case 1:
          others[id].image = playerLeftImage
          break
        case 2:
          others[id].image = playerDownImage
          break
        case 3:
          others[id].image = playerRightImage
          break
      }
      break

    case 'battle-offer':
      console.log('battle-offer')
      var id = dv.getInt16(1)
      battleAnswer(id)
      battle_start = true
      opponent_id = id
      break

    case 'battle-answer':
      var id = dv.getInt16(1)
      battle_start = true
      opponent_id = id
      my_turn = true
      break

    case 'attack':
      var attack = dv.getInt16(5)
      attacked(attack)
      my_turn = true
      break

    case 'video-offer':
      msg = getDictFromBinary(data)
      handleVideoOfferMsg(msg)
      break

    case 'video-answer':
      msg = getDictFromBinary(data)
      handleVideoAnswerMsg(msg)
      break

    case 'new-ice-candidate':
      msg = getDictFromBinary(data)
      handleNewICECandidateMsg(msg)
      break

    case 'hang-up':
      msg = getDictFromBinary(data)
      handleHangUpMsg(data)
      break

    default:
      log_error('Unknown message received:')
      msg = getDictFromBinary(data)
      log_error(msg)
  }
}

function onopen() {
  log('Server Connected')
}

function onerror(data) {
  console.dir(data)
}

function log(text) {
  var time = new Date()
  console.log('[' + time.toLocaleTimeString() + '] ' + text)
}

function log_error(text) {
  var time = new Date()
  console.trace('[' + time.toLocaleTimeString() + '] ' + text)
}

function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`)
}

function connect() {
  var serverUrl
  var scheme = 'ws'
  //   var hostName = 'localhost:3000'
  var hostName = 'http://web3mon.yusangyoon.com.s3-website.ap-northeast-2.amazonaws.com'
  log('Hostname: ' + hostName)

  if (document.location.protocol === 'https:') {
    scheme += 's'
  }

  serverUrl = scheme + '://' + hostName
  log(`Connecting to server: ${serverUrl}`)

  if (ws != undefined) {
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }

  ws = new WebSocket(serverUrl)
  // ws = new WebSocket('ws://ec2-15-164-162-167.ap-northeast-2.compute.amazonaws.com');
  ws.binaryType = 'arraybuffer'

  ws.onopen = () => onopen()
  ws.onerror = ({ data }) => onerror(data)
  ws.onmessage = ({ data }) => onmessage(data)
  ws.onclose = function () {
    ws = null
  }
  return ws
}