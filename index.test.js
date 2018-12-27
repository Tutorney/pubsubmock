const {PublisherClient, SubscriberClient} = require('.').v1;
const publisherClient = new PublisherClient();
const subscriberClient = new SubscriberClient();

const messages = ({data = [], topic}) => ({messages: [{data}], topic});
const subscription = ({subscription} = {}) => ({subscription});

describe('SubscriberClient', function() {
  describe('pull', function() {
    it('should return published messages from default topic and subscription', async function() {
      const expected = 'hello';
      await publisherClient.publish(messages({data: expected}));

      const actual = await subscriberClient.pull(subscription());

      expect(actual).toHaveProperty(
        [0, 'receivedMessages', 0, 'message', 'data'],
        expected,
      );
    });

    it('should not return published messages from other topic', async function() {
      const expected = [];
      await publisherClient.publish(messages({topic: 'other topic'}));

      const actual = await subscriberClient.pull(subscription());

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });

    it('should not return published messages for other subscription', async function() {
      const expected = [];
      await publisherClient.publish(messages({data: expected}));

      const actual = await subscriberClient.pull(
        subscription({subscription: 'other subscription'}),
      );

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });

    it('should pull a message only once', async function() {
      const expected = [];
      await publisherClient.publish(messages({data: expected}));
      await subscriberClient.pull(subscription());

      const actual = await subscriberClient.pull(subscription());

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });
  });

  describe('acknowledge', function() {
    it('should empty messages', async function() {
      const expected = [];
      await publisherClient.publish(messages({data: expected}));
      await subscriberClient.acknowledge();

      const actual = await subscriberClient.pull(subscription());

      expect(actual).toHaveProperty([0, 'receivedMessages'], expected);
    });
  });
});
