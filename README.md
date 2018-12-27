# PubSubMock

Mock for @google-cloud/pubsub v1.

## Environment Variable

- `PUBSUBMOCK_SUBSCRIPTION`, default to `undefined`. When a message is
  published, it's queued if and only if it's topic matches this value.

- `PUBSUBMOCK_TOPIC`, default to `undefined`. When pull is called, it only
  returns messages matching this value.
