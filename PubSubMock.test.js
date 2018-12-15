const {PublisherClient, SubscriberClient} = require('./PubSubMock').v1;
const publisherClient = new PublisherClient();
const subscriberClient = new SubscriberClient();

describe('SubscriberClient', function() {
  describe('pull', function() {
    it('should return published messages', async function() {
      const expected = 'hello';
      await publisherClient.publish({messages: [{data: expected}]});

      const actual = await subscriberClient.pull();

      expect(actual).toHaveProperty(
        [0, 'receivedMessages', 0, 'message', 'data'],
        expected,
      );
    });

    it('should pull a message only once', async function() {
      const expected = [];
      await publisherClient.publish({messages: [{data: expected}]});
      await subscriberClient.pull();

      const actual = await subscriberClient.pull();

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });
  });

  describe('acknowledge', function() {
    it('should empty messages', async function() {
      const expected = [];
      await publisherClient.publish({messages: [{data: expected}]});
      await subscriberClient.acknowledge();

      const actual = await subscriberClient.pull();

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });
  });
});
