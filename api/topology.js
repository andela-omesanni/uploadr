module.exports = function(rabbit, subscribeTo) {

  return rabbit.configure({
    // arguments used to establish a connection to a broker
    connection: {
      server: ['127.0.0.1']
    },

    // define the exchanges
    exchanges: [ 
      {
        name: 'ampq-messages-exchange',
        type: 'fanout'
      }
    ],

    // setup the queues, only subscribing to the one this service
    // will consume messages from
    queues: [ 
      {
        name: 'ampq-messages-queue',
        subscribe: subscribeTo === 'messages'
      }
    ],

    // binds exchanges and queues to one another
    bindings: [ 
      {
        exchange: 'ampq-messages-exchange',
        target: 'ampq-messages-queue',
        keys: []
      }
    ]
  });
};