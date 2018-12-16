class PubSubMock {
  constructor() {
    if (!PubSubMock.singleton) {
      PubSubMock.singleton = this;
      this.acknowledge();
    }
    return PubSubMock.singleton;
  }

  // PublisherClient
  async publish({messages}) {
    this.messages = messages;
  }

  // SubscriberClient
  async pull() {
    const receivedMessages = this.messages.map(message => ({message}));

    // Disallow fetching the same messages during race condition
    this.acknowledge();

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
