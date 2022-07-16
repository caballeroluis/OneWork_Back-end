const offerService = require('../services/offer.service');

const socketRoutes = (io) => {
  io.on('connection', async function(socket) {
    socket.emit('offers', await offerService.getOffers());

    socket.on('connect_error', function(error) {
      console.log('ws connect_error');
      logGenerator()
    })

    socket.on('disconnect', function() {
      console.log('ws disconnect');
    });

    socket.on('join', (roomId) => {
      const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 }
      const numberOfClients = roomClients.length
  
      // These events are emitted only to the sender socket.
      if (numberOfClients == 0) {
        console.log(`Creating room ${roomId} and emitting room_created socket event`)
        socket.join(roomId)
        socket.emit('room_created', roomId)
      } else if (numberOfClients == 1) {
        console.log(`Joining room ${roomId} and emitting room_joined socket event`)
        socket.join(roomId)
        socket.emit('room_joined', roomId)
      } else {
        console.log(`Can't join room ${roomId}, emitting full_room socket event`)
        socket.emit('full_room', roomId)
      }
    })
  
    // These events are emitted to all the sockets connected to the same room except the sender.
    socket.on('start_call', (roomId) => {
      console.log(`Broadcasting start_call event to peers in room ${roomId}`)
      socket.broadcast.to(roomId).emit('start_call')
    })
    socket.on('webrtc_offer', (event) => {
      console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
      socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
    })
    socket.on('webrtc_answer', (event) => {
      console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
      socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
    })
    socket.on('webrtc_ice_candidate', (event) => {
      console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
      socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
    })


    // -----------


      // SOCKET EVENT CALLBACKS =====================================================
    socket.on('start_call', async () => {
      console.log('Socket event callback: start_call')

      if (isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        await createOffer(rtcPeerConnection)
      }
    })

    socket.on('webrtc_offer', async (event) => {
      console.log('Socket event callback: webrtc_offer')

      if (!isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
        await createAnswer(rtcPeerConnection)
      }
    })

    socket.on('webrtc_answer', (event) => {
      console.log('Socket event callback: webrtc_answer')

      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
    })

    socket.on('webrtc_ice_candidate', (event) => {
      console.log('Socket event callback: webrtc_ice_candidate')

      // ICE candidate configuration.
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      })
      rtcPeerConnection.addIceCandidate(candidate)
    })

    // FUNCTIONS ==================================================================
    function addLocalTracks(rtcPeerConnection) {
      localStream.getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, localStream)
      })
    }

    async function createOffer(rtcPeerConnection) {
      let sessionDescription
      try {
        sessionDescription = await rtcPeerConnection.createOffer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
      } catch (error) {
        console.error(error)
      }

      socket.emit('webrtc_offer', {
        type: 'webrtc_offer',
        sdp: sessionDescription,
        roomId,
      })
    }

    async function createAnswer(rtcPeerConnection) {
      let sessionDescription
      try {
        sessionDescription = await rtcPeerConnection.createAnswer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
      } catch (error) {
        console.error(error)
      }

      socket.emit('webrtc_answer', {
        type: 'webrtc_answer',
        sdp: sessionDescription,
        roomId,
      })
    }

    function setRemoteStream(event) {
      remoteVideoComponent.srcObject = event.streams[0]
      remoteStream = event.stream
    }

    function sendIceCandidate(event) {
      if (event.candidate) {
        socket.emit('webrtc_ice_candidate', {
          roomId,
          label: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        })
      }
    }


  });
}

module.exports = socketRoutes;