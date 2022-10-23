const logger = require('../../../../bin/helpers/utils/logger');

describe('Logger', () => {

  describe('log', () => {
    it('should send log', () => {
      logger.log('', { err: 'test'}, '');
    });
  });

  describe('Info', () => {
    it('should send Info', () => {
      logger.info('', { err: 'test'}, '', '');
    });
  });

  describe('Error', () => {
    it('should send Error', () => {
      logger.error('', { err: 'test'}, '', '');
    });
  });

  describe('Info', () => {
    it('should send Error', () => {
      logger.init('', { err: 'test'}, '', '');
    });
  });
});
