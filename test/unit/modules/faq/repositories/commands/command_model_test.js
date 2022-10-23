const { expect } = require('chai');
const faq = require('../../../../../../bin/modules/faq/repositories/commands/command_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('FAQ Commend model test', () => {
  it('should handle right model Topic', () => {
    let result = validator.isValidPayload({
      categoryId:'Internet',
      categoryEn:'Internet',
      descriptionId: 'lorem ipsum',
      descriptionEn: 'lorem ipsum',
      iconMobile:{},
      fileMobile:'file.png',
      iconMobileSize:'100000',
      iconWebsite:{},
      fileWebsite:'file.png',
      iconWebsiteSize:'100000',
      backgroundMobile:{},
      fileBackgroundMobile:'file.png',
      backgroundMobileSize:'100000',
      backgroundWebsite:{},
      fileBackgroundWebsite:'file.png',
      backgroundWebsiteSize:'100000',
      publishDate: '2020-12-27',
      status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['categoryId','categoryEn','descriptionId','descriptionEn',
      'iconMobile','fileMobile','iconMobileSize','iconWebsite','fileWebsite','iconWebsiteSize',
      'backgroundMobile','fileBackgroundMobile','backgroundMobileSize','backgroundWebsite','fileBackgroundWebsite',
      'backgroundWebsiteSize','publishDate','status','creatorId','creatorName']);
    expect(result.err).to.be.null;
  });
  it('should handle error model Topic icon mobile can not be empty', () => {
    let result = validator.isValidPayload({categoryId:'Internet',categoryEn:'Internet',
      descriptionId: 'lorem ipsum',descriptionEn: 'lorem ipsum',
      iconMobile:{}, fileMobile:'',iconMobileSize:0,publishDate: '2020-12-27',status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('icon mobile can not be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle error model Topic icon website can not be empty', () => {
    let result = validator.isValidPayload({categoryId:'Internet',categoryEn:'Internet',
      descriptionId: 'lorem ipsum',descriptionEn: 'lorem ipsum',
      iconMobile:{},fileMobile:'file.png',iconMobileSize:0,iconWebsite:{},
      fileWebsite:'',iconWebsiteSize:'100000',publishDate: '2020-12-27',status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('icon website can not be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle wrong model Topic', () => {
    let result = validator.isValidPayload({categoryId:'Internet',categoryEn:'Internet',
      descriptionId: 'lorem ipsum',descriptionEn: 'lorem ipsum',
      iconMobile:'',fileMobile:'file.png',iconMobileSize:'100000',publishDate: '2020-12-27',status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"iconMobile" must be an object');
    expect(result.err.code).to.equal(400);
  });
  it('should handle error model Topic background mobile can not be empty', () => {
    let result = validator.isValidPayload({categoryId:'Internet',categoryEn:'Internet',
      descriptionId: 'lorem ipsum',descriptionEn: 'lorem ipsum',
      iconMobile:{},fileMobile:'file.png',iconMobileSize:0,iconWebsite:{},
      fileWebsite:'file.png',iconWebsiteSize:'100000',
      backgroundMobile:{},fileBackgroundMobile:'',backgroundMobileSize:'100000',
      publishDate: '2020-12-27',status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('background mobile can not be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle error model Topic background website can not be empty', () => {
    let result = validator.isValidPayload({categoryId:'Internet',categoryEn:'Internet',
      descriptionId: 'lorem ipsum',descriptionEn: 'lorem ipsum',
      iconMobile:{},fileMobile:'file.png',iconMobileSize:0,iconWebsite:{},
      fileWebsite:'file.png',iconWebsiteSize:'100000',
      backgroundMobile:{},fileBackgroundMobile:'file.png',backgroundMobileSize:'100000',
      backgroundWebsite:{},fileBackgroundWebsite:'',backgroundWebsiteSize:'100000',
      publishDate: '2020-12-27',status: 'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.topic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('background website can not be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle right model Topic updated', () => {
    let result = validator.isValidPayload({
      categoryId:'Internet',
      categoryEn:'Internet',
      descriptionId: 'lorem ipsum',
      descriptionEn: 'lorem ipsum',
      iconMobile:{},
      iconMobileSize:'100000',
      iconWebsite:{},
      iconWebsiteSize:'100000',
      backgroundMobile:{},
      backgroundMobileSize:'100000',
      backgroundWebsite:{},
      backgroundWebsiteSize:'100000',
      publishDate: '2020-12-27',
      status: 'active',
      updatedId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      updatedName: 'Super Administrator'}, faq.topicUpdate);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['categoryId','categoryEn','descriptionId','descriptionEn',
      'iconMobile','iconMobileSize','iconWebsite','iconWebsiteSize','backgroundMobile','backgroundMobileSize',
      'backgroundWebsite','backgroundWebsiteSize','publishDate','status','updatedId','updatedName']);
    expect(result.err).to.be.null;
  });
  it('should handle right model remove Topic Id', () => {
    let result = validator.isValidPayload({topicId:'5f3f664b-8992-4c34-b629-0341769c3178'}, faq.removeTopic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['topicId']);
    expect(result.err).to.be.null;
  });
  it('should handle wrong model remove Topic Id', () => {
    let result = validator.isValidPayload({topicId:''}, faq.removeTopic);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"topicId" is not allowed to be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle right model remove FAQ question Id', () => {
    let result = validator.isValidPayload({id:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'}, faq.removeQuestion);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['id']);
    expect(result.err).to.be.null;
  });
  it('should handle wrong model remove FAQ question Id', () => {
    let result = validator.isValidPayload({id:''}, faq.removeQuestion);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"id" is not allowed to be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle right model FAQ question', () => {
    let result = validator.isValidPayload({topicId:'5f3f664b-8992-4c34-b629-0341769c3178',subCategory:'Information',
      titleLangEn:'titleLangEn',titleLangId:'titleLangId',answers:[],publishDate:'2021-01-29',status:'active',
      creatorId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
      creatorName: 'Super Administrator'}, faq.question);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['topicId','subCategory','titleLangEn','titleLangId','answers',
      'publishDate','status','creatorId','creatorName']);
    expect(result.err).to.be.null;
  });
  it('should handle wrong model FAQ question', () => {
    let result = validator.isValidPayload({topicId:'',subCategory:'Information',
      titleLangEn:'titleLangEn', titleLangId:'titleLangId',answers:null,publishDate:'2021-01-29',status:'active'}, faq.question);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"topicId" is not allowed to be empty');
    expect(result.err.code).to.equal(400);
  });
});
