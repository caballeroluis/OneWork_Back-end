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
  });
}

module.exports = socketRoutes;