const {PUBSUBMOCK_SUBSCRIPTION, PUBSUBMOCK_TOPIC} = process.env;

class PubSubMock {
  constructor() {
    if (!PubSubMock.singleton) {
      PubSubMock.singleton = this;
      this.acknowledge();
    }
    return PubSubMock.singleton;
  }

  // PublisherClient
  async publish({messages, topic}) {
    if (topic === PUBSUBMOCK_TOPIC) {
      this.messages = messages;
    }
  }

  // SubscriberClient
  async pull({subscription}) {
    let receivedMessages;
    if (subscription === PUBSUBMOCK_SUBSCRIPTION) {
      receivedMessages = this.messages.map(message => ({message}));

      // Disallow fetching the same messages during race condition
      this.acknowledge();
    } else {
      receivedMessages = [];
    }

    return [{receivedMessages}];
  }
  async acknowledge() {
    this.messages = [];
  }
}

module.exports = {
  v1: {
    PublisherClient: PubSubMock,
    SubscriberClient: PubSubMock,
  },
};
