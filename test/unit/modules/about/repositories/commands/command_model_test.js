const { expect } = require('chai');
const about = require('../../../../../../bin/modules/about/repositories/commands/command_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('About model', () => {
  it('should error image mobile empty postAbout', () => {
    const result = validator.isValidPayload({
      descriptionId: 'test',
      descriptionEn: 'tet.com',
      publish: '2020-10-1',
      url: 'active',
      status: 'active',
      creatorId: 'test name',
      creatorName: 'test creator',
      packageId: 'test package',
      iconWebsite:{},
      iconMobile:{},
      socialMediaWebsite:[],
      socialMediaMobile:[],
      fileIconMobile:'',
      fileIconWebsite:'',
      sizeIconMobile:100,
      sizeIconWebsite:100,
    }, about.postAbout);
    expect(result.err.message).equal('Image My Indihome mobile can not be empty');
  });

  it('should error image website empty postAbout', () => {
    const result = validator.isValidPayload({
      descriptionId: 'test',
      descriptionEn: 'tet.com',
      publish: '2020-10-1',
      url: 'active',
      status: 'active',
      creatorId: 'test name',
      creatorName: 'test creator',
      packageId: 'test package',
      iconWebsite:{
        name:'',
        size:1000
      },
      iconMobile:{
        name:'test.jpg',
        size:1000
      },
      socialMediaWebsite:[],
      socialMediaMobile:['test'],
      fileIconWebsite:'',
      fileIconMobile:'test',
      sizeIconMobile:100,
      sizeIconWebsite:100,
    }, about.postAbout);
    expect(result.err.message).equal('Image My Indihome website can not be empty');
  });

  it('should error image mobile empty updateAbout', () => {
    const result = validator.isValidPayload({
      id: 'test',
      descriptionId: 'test',
      descriptionEn: 'tet.com',
      publish: '2020-10-1',
      url: 'active',
      status: 'active',
      updatedId: 'active',
      updatedName: 'test creator',
      iconWebsite:{
        name:'test.jpg',
        size:1000
      },
      iconMobile:{
        name:'',
        size:1000
      },
      socialMediaWebsite:[],
      socialMediaMobile:[],
    }, about.updateAbout);
    expect(result.err.message).equal('Image My Indihome mobile can not be empty');
  });

  it('should error image mobile to large updateAbout', () => {
    const result = validator.isValidPayload({
      id: 'test',
      descriptionId: 'test',
      descriptionEn: 'tet.com',
      publish: '2020-10-1',
      url: 'active',
      status: 'active',
      updatedId: 'active',
      updatedName: 'test creator',
      iconWebsite:{
        name:'test.jpg',
        size:100000000
      },
      iconMobile:{
        name:'asd.jpg',
        size:100000000
      },
      socialMediaWebsite:[],
      socialMediaMobile:[],
    }, about.updateAbout);
    expect(result.err.message).equal('image mobile size is too large, maximum size is 1mb');
  });

  it('should error image website to large updateAbout', () => {
    const result = validator.isValidPayload({
      id: 'test',
      descriptionId: 'test',
      descriptionEn: 'tet.com',
      publish: '2020-10-1',
      url: 'active',
      status: 'active',
      updatedId: 'active',
      updatedName: 'test creator',
      iconWebsite:{
        name:'test.jpg',
        size:100000000
      },
      iconMobile:{
        name:'asd.jpg',
        size:100
      },
      socialMediaWebsite:[],
      socialMediaMobile:[],
    }, about.updateAbout);
    expect(result.err.message).equal('image website size is too large, maximum size is 1mb');
  });
});


