const joi = require('joi');

const postAbout = joi.object({
  descriptionId: joi.string().required(),
  descriptionEn: joi.string().required(),
  publish: joi.string().required(),
  url: joi.string().required(),
  status: joi.string().valid(['active','inactive']).required(),
  creatorId: joi.string().required(),
  creatorName: joi.string().required(),
  socialMediaWebsite: joi.alternatives().try(joi.object(), joi.array()),
  socialMediaMobile: joi.alternatives().try(joi.object(), joi.array()),
  iconMobile: joi.object().required().allow(''),
  iconWebsite: joi.object().required().allow(''),
  sizeIconWebsite: joi.number().max(1000000).required(),
  sizeIconMobile: joi.number().max(1000000).required(),
  fileIconMobile: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'Image My Indihome mobile can not be empty' };
      }
    });
  }),
  fileIconWebsite: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'Image My Indihome website can not be empty' };
      }
    });
  }),
});

const updateAbout = joi.object({
  id: joi.string().required(),
  descriptionId: joi.string().required(),
  descriptionEn: joi.string().required(),
  publish: joi.string().required(),
  url: joi.string(),
  status: joi.string().valid(['active','inactive']).required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required(),
  socialMediaWebsite: joi.alternatives().try(joi.object(), joi.array()),
  socialMediaMobile: joi.alternatives().try(joi.object(), joi.array()),
  iconMobile: joi.object({
    name: joi.string().required().error((errors) => {
      return errors.map(error => {
        if (error.type === 'any.empty') {
          return { message: 'Image My Indihome mobile can not be empty' };
        }
      });
    }),
    size: joi.number().max(1000000).required().error((errors) => {
      return errors.map(error => {
        if (error.type === 'number.max') {
          return { message: 'image mobile size is too large, maximum size is 1mb' };
        }
      });
    }),
  }).options({allowUnknown:true}),
  iconWebsite: joi.object({
    name: joi.string().required().error((errors) => {
      return errors.map(error => {
        if (error.type === 'any.empty') {
          return { message: 'Image My Indihome website can not be empty' };
        }
      });
    }),
    size: joi.number().max(1000000).required().error((errors) => {
      return errors.map(error => {
        if (error.type === 'number.max') {
          return { message: 'image website size is too large, maximum size is 1mb' };
        }
      });
    }),
  }).options({allowUnknown:true}),
});

const removeAbout = joi.object({
  id: joi.string().required()
});

const aboutModel = () => ({
  aboutId:'',
  description:{
    id:'',
    en:''
  },
  icon:{
    website:'',
    mobile:''
  },
  publish:'',
  status:'',
  creatorId:'',
  creatorName:'',
  updatedId: '',
  updatedName: '',
  createdAt: new Date(),
  lastModified: new Date()
});

module.exports = {
  postAbout,
  aboutModel,
  updateAbout,
  removeAbout
};
