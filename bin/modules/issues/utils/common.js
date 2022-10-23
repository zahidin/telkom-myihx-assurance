const producer = require('../../../helpers/events/kafka/kafka_producer');

const card = () => {
  let model;
  model = {
    userId: '',
    issueId:'',
    indihomeNumber:'',
    issueType: '',
    ticketType: '',
    status: '',
    work: '',
    read: '',
    createdAt: '',
    lastModified: '',
  };
  return model;
};

const sendAssuranceCardToKafka = async (data) => {
  const dataToKafka = {
    topic: 'assurance-card',
    attributes: 1,
    body: {
      userId: data.userId,
      issueId: data.issueId,
      indihomeNumber: data.indihomeNumber,
      issueType: data.issueType,
      ticketType: data.ticketType,
      status: data.status,
      work: data.work,
      read: (data.read === undefined)? 0 : data.read,
      createdAt: data.createdAt,
      lastModified: data.lastModified
    },
    partition: 1
  };
  await producer.kafkaSendProducer(dataToKafka);
};

module.exports = {
  card,
  sendAssuranceCardToKafka
};
