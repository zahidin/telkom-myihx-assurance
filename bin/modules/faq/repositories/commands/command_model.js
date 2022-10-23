const joi = require('joi');

const topic = joi.object({
  categoryId: joi.string().required(),
  categoryEn: joi.string().required(),
  descriptionId: joi.string().required(),
  descriptionEn: joi.string().required(),
  iconMobile: joi.object().required(),
  fileMobile: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'icon mobile can not be empty' };
      }
    }
    );}),
  iconMobileSize: joi.number().max(1000000).required(),
  iconWebsite: joi.object().required(),
  fileWebsite: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'icon website can not be empty' };
      }
    }
    );}),
  iconWebsiteSize: joi.number().max(1000000).required(),
  backgroundMobile: joi.object().required(),
  fileBackgroundMobile: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'background mobile can not be empty' };
      }
    }
    );}),
  backgroundMobileSize: joi.number().max(1000000).required(),
  backgroundWebsite: joi.object().required(),
  fileBackgroundWebsite: joi.string().required().error((errors) => {
    return errors.map(error => {
      if (error.type === 'any.empty') {
        return { message: 'background website can not be empty' };
      }
    }
    );}),
  backgroundWebsiteSize: joi.number().max(1000000).required(),
  publishDate: joi.string().required(),
  status: joi.string().valid(['active', 'inactive']).required(),
  creatorId: joi.string().required(),
  creatorName: joi.string().required()
});

const topicUpdate = joi.object({
  categoryId: joi.string().required(),
  categoryEn: joi.string().required(),
  descriptionId: joi.string().required(),
  descriptionEn: joi.string().required(),
  iconMobile: joi.object().allow('').optional(),
  iconMobileSize: joi.number().max(1000000).required(),
  iconWebsite: joi.object().allow('').optional(),
  iconWebsiteSize: joi.number().max(1000000).required(),
  backgroundMobile: joi.object().allow('').optional(),
  backgroundMobileSize: joi.number().max(1000000).required(),
  backgroundWebsite: joi.object().allow('').optional(),
  backgroundWebsiteSize: joi.number().max(1000000).required(),
  publishDate: joi.string().required(),
  status: joi.string().valid(['active', 'inactive']).required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required()
});

const question = joi.object({
  topicId: joi.string().required(),
  subCategory: joi.string().valid(['Information', 'Troubleshooting']).required(),
  titleLangId: joi.string().required(),
  titleLangEn: joi.string().required(),
  answers: joi.array().allow('').optional(),
  publishDate: joi.string().required(),
  status:joi.string().valid(['active', 'inactive']).required(),
  creatorId: joi.string().required(),
  creatorName: joi.string().required()
});

const questionUpdate = joi.object({
  topicId: joi.string().required(),
  subCategory: joi.string().valid(['Information', 'Troubleshooting']).required(),
  titleLangId: joi.string().required(),
  titleLangEn: joi.string().required(),
  answers: joi.array().allow('').optional(),
  publishDate: joi.string().required(),
  status:joi.string().valid(['active', 'inactive']).required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required()
});

const answer = joi.object({
  keywords: joi.string().required(),
  descriptionLangId: joi.string().required(),
  descriptionLangEn: joi.string().required(),
  publishDate: joi.string().required(),
  status:joi.string().valid(['active', 'inactive']).required(),
  creatorId: joi.string().required(),
  creatorName: joi.string().required()
});

const answerUpdate = joi.object({
  keywords: joi.string().required(),
  descriptionLangId: joi.string().required(),
  descriptionLangEn: joi.string().required(),
  publishDate: joi.string().required(),
  status:joi.string().valid(['active', 'inactive']).required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required()
});

const removeTopic = joi.object({
  topicId: joi.string().required()
});

const removeQuestion = joi.object({
  id: joi.string().required()
});

const removeAnswer = joi.object({
  id: joi.string().required()
});

const removeListAnswer = joi.object({
  questionId: joi.string().required(),
  answerId: joi.string().required(),
});

const onboardingSort = joi.object({
  oldIndex: joi.string().required(),
  newIndex: joi.string().required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required(),
});

const questionSort = joi.object({
  questionId: joi.string().required(),
  oldIndex: joi.string().required(),
  newIndex: joi.string().required(),
  updatedId: joi.string().required(),
  updatedName: joi.string().required(),
});

const topicModel = () => {
  const model = {
    topicId: '',
    categoryId: '',
    categoryEn: '',
    description: '',
    imageMobile: '',
    imageWebsite: '',
    status: 'inactive',
    publishDate: '',
    position: 0,
    creatorId: '',
    creatorName: '',
    updatedId: '',
    updatedName: '',
    createdAt: new Date(),
    lastModified: new Date()
  };
  return model;
};

const questionModel = () => {
  const model = {
    questionId:'',
    topicId:'',
    subCategory:'',
    titleLangId:'',
    titleLangEn:'',
    answers: [],
    publishDate: '',
    status: '',
    creatorId: '',
    creatorName: '',
    updatedId: '',
    updatedName: '',
    createdAt: new Date(),
    lastModified: new Date()
  };
  return model;
};

const answerModel = () => {
  const model = {
    answerId:'',
    keywords:'',
    descriptionLangId:'',
    descriptionLangEn:'',
    publishDate:'',
    status:'',
    creatorId: '',
    creatorName: '',
    updatedId: '',
    updatedName: '',
    createdAt: new Date(),
    lastModified: new Date()
  };
  return model;
};

module.exports = {
  topic,
  onboardingSort,
  questionSort,
  topicUpdate,
  removeTopic,
  removeQuestion,
  removeAnswer,
  removeListAnswer,
  question,
  questionUpdate,
  answer,
  answerUpdate,
  topicModel,
  questionModel,
  answerModel
};
