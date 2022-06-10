const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();

const socketRoutes = (io) => {
  io.on('connection', function(socket) {
    socket.emit('offers', 'cosas');

    eventEmitter.on('innerNewOffer', offer => {
      socket.broadcast.emit('newOffer', offer);
    });

    eventEmitter.on('innerChangeStateOffer', offer => {
      socket.broadcast.emit('changeStateOffer', offer);
    });

    eventEmitter.on('innerDeleteOffer', offer => {
      socket.broadcast.emit('deleteOffer', offer);
    });

    socket.on('disconnect', function() {
      eventEmitter.off('innerNewOffer', () => {
        console.log('innerNewOffer d');
      });
      eventEmitter.off('innerChangeStateOffer', () => {
        console.log('innerChangeStateOffer d');
      });
      eventEmitter.off('innerDeleteOffer', () => {
        console.log('innerChangeStateOffer d');
      });
      console.log('adios que hase');
    });
  });
}

module.exports = {
  socketRoutes,
  eventEmitter
}