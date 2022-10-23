const consumerKafka = require('../../../../../bin/helpers/events/kafka/kafka_consumer');
const kafka = require('kafka-node');
const Consumer = kafka.ConsumerGroup;
const sinon = require('sinon');

describe(__filename, () => {
  const dataConsumer = {
    topic: 'unitTest',
    groupId: 'unitTest'
  };
  it ('ConsumerKafka', async() => {
    sinon.createStubInstance(Consumer);
    new consumerKafka(dataConsumer);
  });
});
