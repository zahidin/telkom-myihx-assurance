const sinon = require('sinon');
const logger = require('../../../../../bin/helpers/utils/logger');
const kafka = require('kafka-node');
const kafkaProd = require('../../../../../bin/helpers/events/kafka/kafka_producer');
const { expect } = require('chai');

describe(__filename, () => {
  beforeEach(async () => {
    sinon.stub(logger, 'log');
  });

  afterEach(async () => {
    logger.log.restore();
  });
  let kafkaProducer;
  const mock = sinon.createSandbox();
  const kafkaHost = 'localhost:8080';
  const client = new kafka.KafkaClient({kafkaHost});
  const producer = new kafka.HighLevelProducer(client);
  kafkaProducer = mock.stub(producer, 'on');
  kafkaProducer.resolves(sinon.stub().yields(null, 'success'));
  kafkaProducer.restore();

  describe('kafka producer', () => {

    it('should send message to kafka', async () => {
      kafkaProducer.returns({
        send : sinon.stub().yields(null, 'success')
      });
      expect(await kafkaProd.kafkaSendProducer({topic: 'assurance-card',attributes: 1,body:{},partition: 1}));
    });
  });
});
