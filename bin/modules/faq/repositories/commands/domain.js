const validate = require('validate.js');
const moment = require('moment');
const Query = require('../queries/query');
const Command = require('./command');
const model = require('./command_model');
const logger = require('../../../../helpers/utils/logger');
const { InternalServerError, NotFoundError, BadRequestError, ConflictError } = require('../../../../helpers/error');
const uuidv4 = require('uuid/v4');
const minio = require('../../../../helpers/components/minio/sdk');
const fs = require('fs');
const wrapper = require('../../../../helpers/utils/wrapper');
const path = require('path');
class Topic {

  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
    this.path = path;
  }

  async postTopic(data) {
    const ctx = 'insertTopicFaq';
    const fileType = ['.jpg','.jpeg','.png'];
    if (fileType.includes(this.path.extname(data.iconMobile.name)) === false
    || fileType.includes(this.path.extname(data.iconWebsite.name)) === false){
      logger.error(ctx, 'error', 'icon website/mobile must be [jpeg,jpg,png]', data.iconMobile.name);
      return wrapper.error(new BadRequestError('icon must be [jpeg,jpg,png]'));
    }

    if (fileType.includes(this.path.extname(data.backgroundMobile.name)) === false
    || fileType.includes(this.path.extname(data.backgroundWebsite.name)) === false){
      logger.error(ctx, 'error', 'icon website/mobile must be [jpeg,jpg,png]', data.backgroundMobile.name);
      return wrapper.error(new BadRequestError('background must be [jpeg,jpg,png]'));
    }

    const topic = await this.query.findTopicFaq({categoryId:data.categoryId, categoryEn:data.categoryEn});
    if(!topic.err){
      logger.error(ctx, 'error', 'Topic faq already exist', topic.err);
      return wrapper.error(new ConflictError('Topic faq already exist'));
    }

    const topicModel = model.topicModel();
    topicModel.topicId = uuidv4();
    topicModel.categoryId = data.categoryId;
    topicModel.categoryEn = data.categoryEn;
    topicModel.description = {
      id: data.descriptionId,
      en: data.descriptionEn
    };
    topicModel.imageMobile  = {
      icon: await this.uploadImagesMinio({image: data.iconMobile, bucket: 'topic', directory:'mobile/icon'}),
      background: await this.uploadImagesMinio({image: data.backgroundMobile, bucket: 'topic', directory:'mobile/background'}),
    };
    topicModel.imageWebsite = {
      icon: await this.uploadImagesMinio({image: data.iconWebsite, bucket: 'topic', directory:'website/icon'}),
      background : await this.uploadImagesMinio({image: data.backgroundWebsite, bucket: 'topic', directory:'website/background'}),
    };
    topicModel.status = data.status;
    topicModel.publishDate = data.publishDate;
    topicModel.creatorId = data.creatorId;
    topicModel.creatorName = data.creatorName;
    const result = await this.command.insertTopicFaq(topicModel);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async updateTopicList(payload){
    const ctx = 'domain-updateTopicList';
    const { oldIndex, newIndex, updatedId, updatedName } = payload;
    const topic = await this.query.findManySort({status: 'active'});
    if (topic.err) {
      logger.error(ctx, 'error', 'topic not result', topic.err);
      return wrapper.error(new NotFoundError('topic not result'));
    }
    let resultMove = await this.move(topic.data, oldIndex, newIndex);
    const result = resultMove.map(async (obj, i) => {
      let updateDocument = {
        $set: {
          position: i,
          updatedId: updatedId,
          updatedName: updatedName,
        }
      };
      return await this.command.upsertTopic({topicId: obj.topicId}, updateDocument);
    });
    return result;
  }

  async updateTopic(topicId, data) {
    const ctx = 'updatedTopicFaq';
    const topic = await this.query.findTopicFaq({topicId: topicId});
    if(topic.err){
      logger.error(ctx, 'error', 'Topic FAQ not found', topic.err);
      return wrapper.error(new NotFoundError('Topic FAQ not found'));
    }

    let uploadIconMobile = topic.data.imageMobile.icon;
    let uploadIconWebsite = topic.data.imageWebsite.icon;
    const fileType = ['.jpg','.jpeg','.png'];
    if (!validate.isEmpty(data.iconMobile) && !validate.isEmpty(data.iconWebsite)) {
      if (!validate.isEmpty(data.iconMobile.name) && !validate.isEmpty(data.iconWebsite.name)){
        if (fileType.includes(this.path.extname(data.iconMobile.name)) === false
        || fileType.includes(this.path.extname(data.iconWebsite.name)) === false){
          logger.error(ctx, 'error', 'icon website/mobile be [jpeg,jpg,png]', data.iconWebsite.name);
          return wrapper.error(new BadRequestError('icon website/mobile must be [jpeg,jpg,png]'));
        }

        const website = topic.data.imageWebsite.icon.split('/');
        const mobile = topic.data.imageMobile.icon.split('/');
        await this.removeImagesMinio({bucket: 'topic', directory:'mobile/icon', name: ('', website[3]) });
        await this.removeImagesMinio({bucket: 'topic', directory:'website/icon', name: ('', mobile[3]) });
        uploadIconMobile = await this.uploadImagesMinio({image: data.iconMobile, bucket: 'topic', directory:'mobile/icon'});
        uploadIconWebsite = await this.uploadImagesMinio({image: data.iconWebsite, bucket: 'topic', directory:'website/icon'});
      }
    }

    let uploadBackgroundMobile = topic.data.imageMobile.background;
    let uploadBackgroundWebsite = topic.data.imageWebsite.background;
    if (!validate.isEmpty(data.backgroundMobile) && !validate.isEmpty(data.backgroundWebsite)) {
      if (!validate.isEmpty(data.backgroundMobile.name) && !validate.isEmpty(data.backgroundWebsite.name)){
        if (fileType.includes(this.path.extname(data.backgroundMobile.name)) === false
        || fileType.includes(this.path.extname(data.backgroundWebsite.name)) === false){
          logger.error(ctx, 'error', 'background website/mobile be [jpeg,jpg,png]', data.backgroundWebsite.name);
          return wrapper.error(new BadRequestError('background website/mobile must be [jpeg,jpg,png]'));
        }

        const website = topic.data.imageWebsite.background.split('/');
        const mobile = topic.data.imageMobile.background.split('/');
        await this.removeImagesMinio({bucket: 'topic', directory:'website/background', name: ('', website[3]) });
        await this.removeImagesMinio({bucket: 'topic', directory:'mobile/background', name: ('', mobile[3]) });
        uploadBackgroundMobile = await this.uploadImagesMinio({image: data.backgroundMobile, bucket: 'topic', directory:'mobile/background'});
        uploadBackgroundWebsite = await this.uploadImagesMinio({image: data.backgroundWebsite, bucket: 'topic', directory:'website/background'});
      }
    }

    let position;
    if(data.status == 'active' && topic.data.status == 'inactive'){
      const topicPosition = await this.query.findManySort({status: 'active'});
      if (topicPosition.err) {
        position = 1;
      }else{
        const positionMax = Math.max.apply(Math, topicPosition.data.map(item => { return item.position; }));
        position = positionMax + 1;
      }
    }else if(data.status == topic.data.status){
      position = topic.data.position;
    }else{
      position = 0;
    }

    const updateDocument = {
      $set: {
        categoryId: validate.isEmpty(data.categoryId) ? topic.data.categoryId : data.categoryId,
        categoryEn: validate.isEmpty(data.categoryEn) ? topic.data.categoryId : data.categoryEn,
        description: {
          id: validate.isEmpty(data.descriptionId) ? topic.data.description.descriptionId : data.descriptionId,
          en: validate.isEmpty(data.descriptionEn) ? topic.data.description.descriptionEn : data.descriptionEn,
        },
        imageMobile: {
          icon: uploadIconMobile,
          background: uploadBackgroundMobile
        },
        imageWebsite: {
          icon: uploadIconWebsite,
          background: uploadBackgroundWebsite
        },
        status: validate.isEmpty(data.status) ? topic.data.status : data.status,
        publishDate: validate.isEmpty(data.publishDate) ? topic.data.publishDate : data.publishDate,
        position: position,
        updatedId: data.updatedId,
        updatedName: data.updatedName,
        lastModified: new Date()
      }
    };
    const result = await this.command.upsertTopic({topicId: topic.data.topicId}, updateDocument);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async removeTopic(payload) {
    const ctx = 'removeTopicFaq';
    const question = await this.query.findQuestionOne(payload);
    if(!question.err){
      logger.error(ctx, 'error', 'The topic cannot be deleted, because it is used in the question', question.err);
      return wrapper.error(new NotFoundError('The topic cannot be deleted, because it is used in the question'));
    }

    const topic = await this.query.findTopicFaq(payload);
    if(topic.err){
      logger.error(ctx, 'error', 'Topic FAQ not found', topic.err);
      return wrapper.error(new NotFoundError('Topic FAQ not found'));
    }

    const urlImageIconMobile = topic.data.imageMobile.icon.split('/');
    const urlImageBackgroundMobile = topic.data.imageMobile.background.split('/');
    const urlImageIconWebsite = topic.data.imageWebsite.icon.split('/');
    const urlImageBackgroundWebsite = topic.data.imageWebsite.background.split('/');
    const iconMobile = ('', urlImageIconMobile[3]);
    const iconWebsite = ('', urlImageIconWebsite[3]);
    const backgroundMobile = ('', urlImageBackgroundMobile[3]);
    const backgroundWebsite = ('', urlImageBackgroundWebsite[3]);
    const result = await this.command.removeTopic({topicId: topic.data.topicId});
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    await this.removeImagesMinio({bucket: 'topic', directory:'mobile/icon', name: iconMobile });
    await this.removeImagesMinio({bucket: 'topic', directory:'website/icon', name: iconWebsite });
    await this.removeImagesMinio({bucket: 'topic', directory:'website/background', name: backgroundWebsite });
    await this.removeImagesMinio({bucket: 'topic', directory:'mobile/background', name: backgroundMobile });
    return result;
  }

  async postQuestion(data) {
    const ctx = 'insertQuestion';
    const compareDate = moment(new Date()).format('YYYY-MM-DD');
    if(data.publishDate <= compareDate ){
      logger.error(ctx, 'error', 'Publish date must be more than current date', data.publishDate);
      return wrapper.error(new BadRequestError('Publish date must be more than current date'));
    }

    const topic = await this.query.findTopic({topicId:data.topicId});
    if (topic.err) {
      logger.error(ctx, 'error', 'Topic FAQ not found', topic.err);
      return wrapper.error(new NotFoundError('Topic FAQ not found'));
    }

    const questionModel = model.questionModel();
    questionModel.questionId = uuidv4();
    questionModel.topicId = data.topicId;
    questionModel.subCategory = data.subCategory;
    questionModel.titleLangId = data.titleLangId;
    questionModel.titleLangEn = data.titleLangEn;
    questionModel.answers = data.answers;
    questionModel.publishDate = data.publishDate;
    questionModel.status = data.status;
    questionModel.creatorId = data.creatorId;
    questionModel.creatorName = data.creatorName;
    const question = await this.command.insertQuestion(questionModel);
    if(question.err){
      logger.error(ctx, 'error', 'Internal server error', question.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    delete question.data._id;
    return question;
  }

  async updateQuestion(questionId, data) {
    const ctx = 'updatedQuestion';
    const compareDate = moment(new Date()).format('YYYY-MM-DD');
    if(data.status === 'inactive' && data.publishDate <= compareDate ){
      logger.error(ctx, 'error', 'Publish date must be more than current date', data.publishDate);
      return wrapper.error(new BadRequestError('Publish date must be more than current date'));
    }

    const question = await this.query.findQuestionOne({questionId: questionId});
    if(question.err){
      logger.error(ctx, 'error', 'FAQ question not found', question.err);
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }

    const updateDocument = {
      $set: {
        subCategory: validate.isEmpty(data.subCategory) ? question.data.subCategory : data.subCategory,
        topicId: validate.isEmpty(data.topicId) ? question.data.topicId : data.topicId,
        titleLangId: validate.isEmpty(data.titleLangId) ? question.data.titleLangId : data.titleLangId,
        titleLangEn: validate.isEmpty(data.titleLangEn) ? question.data.titleLangEn : data.titleLangEn,
        answers: validate.isEmpty(data.answers) ? question.data.answers : data.answers,
        publishDate:validate.isEmpty(data.publishDate) ? question.data.publishDate : data.publishDate,
        status: validate.isEmpty(data.status) ? question.data.status : data.status,
        updatedId: data.updatedId,
        updatedName: data.updatedName,
        lastModified: new Date()
      }
    };
    const result = await this.command.upsertQuestion({questionId: question.data.questionId}, updateDocument);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    delete result.data._id;
    return result;
  }

  async removeQuestion(payload) {
    const ctx = 'removeQuestion';
    const question = await this.query.findQuestionOne({questionId: payload.id});
    if(question.err){
      logger.error(ctx, 'error', 'FAQ question not found', question.err);
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }

    const result = await this.command.removeQuestion({questionId: payload.id});
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async postAnswer(data) {
    const ctx = 'postAnswer';
    const compareDate = moment(new Date()).format('YYYY-MM-DD');
    if(data.status === 'inactive' && data.publishDate <= compareDate ){
      logger.error(ctx, 'error', 'Publish date must be more than current date', data.publishDate);
      return wrapper.error(new BadRequestError('Publish date must be more than current date'));
    }

    const answerModel = model.answerModel();
    answerModel.answerId = uuidv4();
    answerModel.keywords = data.keywords;
    answerModel.descriptionLangId = data.descriptionLangId;
    answerModel.descriptionLangEn = data.descriptionLangEn;
    answerModel.publishDate = data.publishDate;
    answerModel.status = data.status;
    answerModel.creatorId = data.creatorId;
    answerModel.creatorName = data.creatorName;
    const answer = await this.command.insertAnswer(answerModel);
    if(answer.err){
      logger.error(ctx, 'error', 'Internal server error', answer.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    delete answer.data._id;
    return answer;
  }

  async updateAnswer(id, data) {
    const ctx = 'updateAnswer';
    const compareDate = moment(new Date()).format('YYYY-MM-DD');
    if(data.publishDate <= compareDate ){
      logger.error(ctx, 'error', 'Publish date must be more than current date', data.publishDate);
      return wrapper.error(new BadRequestError('Publish date must be more than current date'));
    }

    const answer = await this.query.findAnswerOne({answerId: id});
    if(answer.err){
      logger.error(ctx, 'error', 'FAQ answer not found', answer.err);
      return wrapper.error(new NotFoundError('FAQ answer not found'));
    }

    const updateDocument = {
      $set: {
        keywords: validate.isEmpty(data.keywords) ? answer.data.keywords : data.keywords,
        descriptionLangId: validate.isEmpty(data.descriptionLangId) ? answer.data.descriptionLangId : data.descriptionLangId,
        descriptionLangEn: validate.isEmpty(data.descriptionLangEn) ? answer.data.descriptionLangEn : data.descriptionLangEn,
        publishDate: validate.isEmpty(data.publishDate) ? answer.data.publishDate : data.publishDate,
        status: validate.isEmpty(data.status) ? answer.data.publishDate : data.status,
        updatedId: data.updatedId,
        updatedName: data.updatedName,
        lastModified: new Date()
      }
    };
    const result = await this.command.upsertAnswer({answerId: id}, updateDocument);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    delete result.data._id;
    return result;
  }

  async removeAnswer(payload) {
    const ctx = 'removeAnswer';
    const question = await this.query.findQuestionOne({answerId: payload.id});
    if(!question.err){
      logger.error(ctx, 'error', 'The answer cannot be deleted, because it is used in the question', question.err);
      return wrapper.error(new NotFoundError('The answer cannot be deleted, because it is used in the question'));
    }

    const answer = await this.query.findAnswerOne({answerId: payload.id});
    if(answer.err){
      logger.error(ctx, 'error', 'FAQ answer not found', answer.err);
      return wrapper.error(new NotFoundError('FAQ answer not found'));
    }

    const result = await this.command.removeAnswer({answerId: payload.id});
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async updatedListAnswer(payload){
    const ctx = 'updatedListAnswer';
    const { questionId, oldIndex, newIndex, updatedId, updatedName } = payload;
    const question = await this.query.findQuestionOne({questionId: questionId});
    if (question.err) {
      logger.error(ctx, 'error', 'Question not found', question.err);
      return wrapper.error(new NotFoundError('Question not found'));
    }
    const questionSort = question.data.answers.sort((a, b) => {return a.number - b.number;});
    let resultMove = await this.move(questionSort, oldIndex, newIndex);
    const result = resultMove.map(async (obj, i) => {
      let updateDocument = {
        $set: {
          updatedId: updatedId,
          updatedName: updatedName,
          'answers.$.number' : i
        }
      };
      return await this.command.upsertQuestion({questionId: questionId,
        answers: { $elemMatch: { answerId: obj.answerId } } },updateDocument
      );
    });
    return result;
  }

  async removeListAnswer(payload){
    const ctx = 'removeListAnswer';
    const question = await this.query.find({questionId: payload.questionId, answers: {
      $elemMatch: { answerId: payload.answerId } }
    });
    if(question.err){
      logger.error(ctx, 'error', 'question answer not found', question.err);
      return wrapper.error(new NotFoundError('question answer not found'));
    }

    const result = await this.command.upsertQuestion({questionId: payload.questionId},
      {
        $pull: {
          answers: {answerId: payload.answerId}
        }
      });
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async uploadImagesMinio(data) {
    const ctx = 'uploadImagesMinio';
    const imgName = data.image.name;
    const fileExt = this.path.extname(imgName);
    const newImageName = uuidv4() + fileExt;
    let image = '';
    const bucket = data.bucket;
    const key = `${data.directory}/${newImageName}`;
    const upload = await minio.objectUpload(bucket, key, data.image.path);
    if (!upload.err) {
      image = `${bucket}/${key}`;
      fs.unlinkSync(data.image.path);
      logger.log(ctx, 'success', 'Succes upload image');
    }else {
      image = `${bucket}/default_picture.png`;
      logger.log(ctx, 'error', 'Failed upload image', upload.err);
    }
    return image;
  }

  async removeImagesMinio(data) {
    const ctx = 'removeImagesMinio';
    const bucket = data.bucket;
    const file = `${data.directory}/${data.name}`;
    const remove = await minio.objectRemove(bucket, file);
    if (!remove.err) {
      logger.log(ctx, 'success', 'Succes remove image');
    }else {
      logger.log(ctx, 'error', 'Failed remove image', remove.err);
    }
    return remove;
  }

  async move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }
}

module.exports = Topic;
