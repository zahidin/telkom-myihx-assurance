const Query = require('./query');
const QueryUser = require('../../../user/repositories/queries/query');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError, UnauthorizedError, InternalServerError, ServiceUnavailableError, BadRequestError } = require('../../../../helpers/error');
const logger = require('../../../../helpers/utils/logger');
const status = require('../../utils/status');
const service = require('../../utils/service');
const Model = require('./query_model');
const commonUtil = require('../../../../helpers/utils/common');
const Fuse = require('fuse.js');
const FuzzySet = require('fuzzyset');
const validate = require('validate.js');
const moment = require('moment');
const config = require('../../../../infra/configs/global_config');
const producer = require('../../../../helpers/events/kafka/kafka_producer');

class Faq {

  constructor(db) {
    this.query = new Query(db);
    this.queryUser = new QueryUser(db);
  }

  async getTopicFaq(){
    const ctx = 'domain-getTopicFaq';
    const topic = await this.query.findAll({status: 'active'});
    if(topic.err){
      logger.error(ctx, 'error', 'Topic not result', topic.err);
      return wrapper.error(new NotFoundError('Topic not result'));
    }

    const result = topic.data.map(obj => {
      return {
        topicId: obj.topicId,
        category: obj.categoryId
      };
    });
    return wrapper.data(result);
  }

  async getFaq(lang) {
    const topicResult = [];
    const questionResult = [];
    const topic = await this.query.findManySort({status:'active'});
    if (!topic.err) {
      topic.data.map(async obj => {
        let categories = (lang === 'en')? obj.categoryEn : obj.categoryId;
        topicResult.push({
          topicId: obj.topicId,
          category: categories,
          imageMobile: {
            icon: `${config.get('/minioBaseUrl')}/${obj.imageMobile.icon}`,
            background: `${config.get('/minioBaseUrl')}/${obj.imageMobile.background}`,
          },
          imageWebsite: {
            icon: `${config.get('/minioBaseUrl')}/${obj.imageWebsite.icon}`,
            background: `${config.get('/minioBaseUrl')}/${obj.imageWebsite.background}`,
          },
          position: obj.position,
        });
      });
    }

    const question = await this.query.findAggregate([{
      $lookup: {
        from: 'question',
        localField: 'questionId',
        foreignField: 'questionId',
        as: 'most'
      }
    }]);
    if (!question.err) {
      question.data.map(async obj => {
        obj.most.map(m => {
          let title = (lang === 'en')? m.titleLangEn : m.titleLangId;
          questionResult.push({
            questionId: obj.questionId,
            topicId: obj.topicId,
            subcategory: obj.subCategory,
            title: title,
            count: obj.count
          });
        });
      });
    }

    const data = {
      topic: topicResult,
      mostPopular: questionResult,
    };
    return wrapper.data(data);
  }

  async getTopicDetail(id){
    const ctx = 'domain-getTopicById';
    const topic = await this.query.findTopicFaq({topicId:id});
    if(topic.err){
      logger.error(ctx, 'error', 'Topic not found', topic.err);
      return wrapper.error(new NotFoundError('Topic not found'));
    }
    const { data } = topic;
    const result = {
      topicId: data.topicId,
      categoryId: data.categoryId,
      categoryEn: data.categoryEn,
      description: {
        id: data.description.id,
        en: data.description.en
      },
      imageMobile: {
        icon: `${config.get('/minioBaseUrl')}/${data.imageMobile.icon}`,
        background: `${config.get('/minioBaseUrl')}/${data.imageMobile.background}`
      },
      imageWebsite: {
        icon: `${config.get('/minioBaseUrl')}/${data.imageWebsite.icon}`,
        background: `${config.get('/minioBaseUrl')}/${data.imageWebsite.background}`
      },
      publishDate: data.publishDate,
      status: data.status,
      position: data.position,
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      createdAt: data.createdAt,
      lastModified: data.lastModified
    };
    return wrapper.data(result);
  }

  async listTopicFaq(payload) {
    const ctx = 'domain-listTopicFaq';
    let resultData = {
      data: {},
      meta:{
        page: 1,
        limit: 1,
        totalPage: 1,
        totalRecord: 1
      }
    };

    let i = 0;
    let {row, page, title, status, lastUpdated} = payload;
    row = parseInt(row) || 0;
    if(row <= 0) row = 10;
    page = parseInt(page) || 0;
    if(page <= 0) page = 1;

    const params = {};
    const lastModifiedGte = new Date(lastUpdated + 'T00:00:00.000+07:00');
    const lastModifiedLte = new Date(lastUpdated + 'T23:59:59.000+07:00');
    if(title) params.$or = [
      {categoryId: {'$regex': title,'$options': 'i'} },
      {creatorName: {'$regex': title,'$options': 'i'} }
    ];
    if(status) params.status = {$in:JSON.parse(status)};
    if(lastUpdated) params.$and = [
      {$expr: { $gte: [ '$lastModified', lastModifiedGte ] } },
      {$expr: { $lte: [ '$lastModified', lastModifiedLte ] } }
    ];
    const topic = await this.query.findAllTopic({status: 1, position: 1}, row, page, params);
    if (topic.err) {
      logger.error(ctx, 'error', 'Topic FAQ not found', topic.err);
      return wrapper.error('Topic FAQ not found');
    }

    const results = topic.data.map(obj => {
      return {
        indexTopic: i++,
        topicId: obj.topicId,
        category: obj.categoryId,
        image: {
          icon: `${config.get('/minioBaseUrl')}/${obj.imageMobile.icon}`,
          background: `${config.get('/minioBaseUrl')}/${obj.imageMobile.background}`,
        },
        publishDate: obj.publishDate,
        status: obj.status,
        position: obj.position,
        creatorName: obj.creatorName,
        createdAt: obj.createdAt,
        lastModified: obj.lastModified
      };
    });
    resultData.data = results;
    let countTotal = await this.query.countOnboarding({...params});
    countTotal = ( countTotal.data ? countTotal.data : 0);
    resultData.meta = {
      page,
      limit: row,
      totalPage: Math.ceil(countTotal / row),
      totalRecord: countTotal
    };
    return wrapper.paginationData(resultData.data, resultData.meta);
  }

  async getAnswers(payload) {
    const ctx = 'domain-getAnswers';
    let resultData = {
      data: {},
      meta:{
        page: 1,
        limit: 1,
        totalPage: 1,
        totalRecord: 1
      }
    };

    let {row, page, title, status, lastUpdated} = payload;
    row = parseInt(row) || 0;
    if(row <= 0) row = 10;
    page = parseInt(page) || 0;
    if(page <= 0) page = 1;

    const params = {};
    const lastModifiedGte = new Date(lastUpdated + 'T00:00:00.000+07:00');
    const lastModifiedLte = new Date(lastUpdated + 'T23:59:59.000+07:00');
    if(title) params.$or = [
      {descriptionLangId: {'$regex': title,'$options': 'i'} },
      {keywords: {'$regex': title,'$options': 'i'} },
      {creatorName: {'$regex': title,'$options': 'i'} }
    ];
    if(status) params.status = {$in:JSON.parse(status)};
    if(lastUpdated) params.$and = [
      {$expr: { $gte: [ '$lastModified', lastModifiedGte ] } },
      {$expr: { $lte: [ '$lastModified', lastModifiedLte ] } }
    ];
    const topic = await this.query.findAllAnswer('lastModified', row, page, params);
    if (topic.err) {
      logger.error(ctx, 'error', 'Answer not result', topic.err);
      return wrapper.error('Answer not result');
    }
    const results = topic.data.map( obj => {
      return {
        answerId: obj.answerId,
        keywords: obj.keywords,
        title: obj.descriptionLangId,
        publishDate: obj.publishDate,
        status: obj.status,
        creatorName: obj.creatorName,
        createdAt: obj.createdAt,
        lastModified: obj.lastModified
      };
    });
    resultData.data = results;
    let countTotal = await this.query.countAnswer({...params});
    countTotal = ( countTotal.data ? countTotal.data : 0);
    resultData.meta = {
      page,
      limit: row,
      totalPage: Math.ceil(countTotal / row),
      totalRecord: countTotal
    };
    return wrapper.paginationData(resultData.data, resultData.meta);
  }

  async getAnswerDetail(id){
    const ctx = 'domain-getAnswerById';
    const answer = await this.query.findAnswerOne({answerId:id});
    if(answer.err){
      logger.error(ctx, 'error', 'Answer not found', answer.err);
      return wrapper.error(new NotFoundError('Answer not found'));
    }
    const { data } = answer;
    const result = {
      answerId: data.answerId,
      keywords: data.keywords,
      description: {
        id: data.descriptionLangId,
        en: data.descriptionLangEn
      },
      publishDate: data.publishDate,
      status: data.status,
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      createdAt: data.createdAt,
      lastModified: data.lastModified
    };
    return wrapper.data(result);
  }

  async getQuestion(payload) {
    const ctx = 'domain-getQuestion';
    let resultData = {
      data: {},
      meta:{
        page: 1,
        limit: 1,
        totalPage: 1,
        totalRecord: 1
      }
    };
    let {row, page, title, topic, category, status, lastUpdated} = payload;
    row = parseInt(row) || 0;
    if(row <= 0) row = 10;
    page = parseInt(page) || 0;
    if(page <= 0) page = 1;

    const topicAll = [];
    const topics = await this.query.findAll();
    if(!topics.err){
      topics.data.map( a => {
        topicAll.push(a.topicId);
      });
    }
    const params = [];
    const lastModifiedGte = new Date(lastUpdated + 'T00:00:00.000+07:00');
    const lastModifiedLte = new Date(lastUpdated + 'T23:59:59.000+07:00');
    if(title) params.push({titleLangId:{'$regex': title,'$options': 'i'}});
    if(topic) {
      params.push({'data.topicId':{$in:JSON.parse(topic)}});
    }else{
      params.push({'data.topicId':{$in:topicAll}});
    }
    if(status) params.push({status:{$in:JSON.parse(status)}});
    if(category) params.push({subCategory:{$in:JSON.parse(category)}});
    if(lastUpdated) params.push({lastModified: {$gte:lastModifiedGte, $lte:lastModifiedLte}});
    const query = [{
      $lookup:{
        from: 'topic-faq',
        localField:'topicId',
        foreignField:'topicId',
        as: 'data',
      }
    },
    {$unwind: { path: '$data' } },
    {$match: { $and: params } }];
    let countTotal = await this.query.aggregateQuestion(query);
    query.push({ $sort : { 'lastModified' : 1 } });
    query.push({ $skip: row * (page - 1) });
    query.push({ $limit : row });
    const question = await this.query.aggregateQuestion(query);
    if (question.err) {
      logger.error(ctx, 'error', 'Question not result', question.err);
      return wrapper.error('Question not result');
    }
    const results = question.data.map( obj => {
      return {
        questionId: obj.questionId,
        topicId: obj.topicId,
        topic: obj.data.categoryId,
        subCategory: obj.subCategory,
        title: obj.titleLangId,
        publishDate: obj.publishDate,
        status: obj.status,
        creatorName: obj.creatorName,
        createdAt: obj.createdAt,
        lastModified: obj.lastModified
      };
    });
    resultData.data = results;
    countTotal = ( countTotal.data.length ? countTotal.data.length : 0);
    resultData.meta = {
      page : page,
      limit : row,
      totalPage : Math.ceil(countTotal / row),
      totalRecord : countTotal,
    };
    return wrapper.paginationData(resultData.data, resultData.meta);
  }

  async getQuestionDetail(id){
    const ctx = 'domain-getQuestionById';
    const question = await this.query.findQuestionOne({questionId:id});
    if(question.err){
      logger.error(ctx, 'error', 'Question not found', question.err);
      return wrapper.error(new NotFoundError('Question not found'));
    }

    const { data } = question;
    let answersResult = [];
    const answers = await this.query.findAnswer();
    data.answers.map(d => {
      answers.data.map(a => {
        if(a.answerId == d.answerId){
          answersResult.push({
            answerId: d.answerId,
            description: a.descriptionLangId,
            number: d.number,
          });
        }
      });
    });

    const result = {
      questionId: data.questionId,
      topicId: data.topicId,
      subCategory: data.subCategory,
      title: {
        id: data.titleLangId,
        en: data.titleLangEn
      },
      answers: answersResult,
      publishDate: data.publishDate,
      status: data.status,
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      createdAt: data.createdAt,
      lastModified: data.lastModified
    };
    return wrapper.data(result);
  }

  async getFaqQuestion(topicId, lang) {
    const faq = await this.query.find({topicId: topicId, status: 'active'});
    if (faq.err) {
      return wrapper.error(new NotFoundError('FAQ question by id topic not found'));
    }

    const results = faq.data.map(obj => {
      let question = (lang === 'en')? obj.titleLangEn:obj.titleLangId;
      return {
        topicId : obj.topicId,
        questionId : obj.questionId,
        subCategory: obj.subCategory,
        question: question
      };
    });
    return wrapper.data( results );
  }

  async searchFaq(payload) {
    const ctx = 'domain-searchFaq';
    const {lang, keyword} = payload;
    const faq = await this.query.findAllQuestion({status:'active'});
    if (faq.err) {
      logger.error(ctx, 'error', 'FAQ question not found', faq.err);
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }
    const results = faq.data.map(obj => (
      {
        topicId: obj.topicId,
        questionId: obj.questionId,
        subCategory: obj.subCategory,
        question: (lang === 'en') ? obj.titleLangEn : obj.titleLangId,
        titleLangEn: obj.titleLangEn,
        titleLangId: obj.titleLangId
      }
    ));
    const options = {
      includeScore: true,
      keys: [
        {
          name: 'titleLangEn',
          weight: 0.5
        },
        {
          name: 'titleLangId',
          weight: 0.5
        }
      ]
    };
    const fuse = new Fuse(results, options);
    const resultFuse = fuse.search(keyword);
    const resultArray = [];
    resultFuse.map((items,index) =>{
      if (index < 10){
        resultArray.push({
          topicId : items.item.topicId,
          questionId : items.item.questionId,
          subCategory: items.item.subCategory,
          question: items.item.question
        });
      }
    });
    return wrapper.data(resultArray);
  }

  async searchAnswer(payload) {
    const ctx = 'domain-searchAnswers';
    const {keyword} = payload;
    const answers = await this.query.findAnswer({status:'active'});
    if (answers.err) {
      logger.error(ctx, 'error', 'FAQ answer not found', answers.err);
      return wrapper.error(new NotFoundError('FAQ answer not found'));
    }
    const results = answers.data.map(obj => ({
      answerId : obj.answerId,
      descriptionLangId : obj.descriptionLangId
    }));
    const options = {
      includeScore: true,
      keys: [
        {
          name: 'descriptionLangId',
          weight: 0.5
        }
      ]
    };
    const keywords = (keyword == undefined)? 'i' : keyword;
    const fuse = new Fuse(results, options);
    const resultFuse = fuse.search(keywords);
    let resultArray = [];
    resultFuse.map((items, index) => {
      if (index < 20){
        resultArray.push({
          answerId : items.item.answerId,
          description : items.item.descriptionLangId
        });
      }
    });
    return wrapper.data(resultArray);
  }

  async getFaqQuestionDetail(questionId, lang) {
    const faq = await this.query.findQuestionOne({questionId: questionId});
    if (faq.err) {
      return wrapper.error(new NotFoundError('FAQ question by id question not found'));
    }

    const { data } = faq;
    let question = (lang === 'en')? data.titleLangEn:data.titleLangId;
    const results = data.answers.map(obj => {
      return {
        topicId : data.topicId,
        questionId : data.questionId,
        subCategory: data.subCategory,
        question: question,
        answerId: obj.answerId,
        number: obj.number
      };
    });
    let answers = await this.query.findAnswer();
    const resultAnswer = answers.data.map( r => {
      let description = (lang === 'en')? r.descriptionLangEn:r.descriptionLangId;
      return { answerId: r.answerId, keywords: r.keywords, description: description };
    });

    const merge = results.map( a => {
      let c = resultAnswer.find( b => b.answerId === a.answerId);
      return {
        topicId : a.topicId,
        questionId : a.questionId,
        keywords: c.keywords,
        subCategory: a.subCategory,
        question: a.question,
        answerId: c.answerId,
        description: c.description,
        number: a.number
      };
    });
    const dataToKafka = {
      topic: 'counter-faq',
      attributes: 1,
      body: {
        topicId: data.topicId,
        questionId: data.questionId,
        subCategory: data.subCategory
      },
      partition: 1
    };
    await producer.kafkaSendProducer(dataToKafka);
    return wrapper.data( merge );
  }

  async getFaqSubCategory(params, lang) {
    const { topicId, subcategory } = params;
    const faq = await this.query.find({topicId: topicId, subCategory: subcategory, status: 'active'});
    if (faq.err) {
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }

    let arraysResult = [];
    faq.data.map(data => {
      let question = (lang === 'en')? data.titleLangEn:data.titleLangId;
      data.answers.map(obj => {
        arraysResult.push({
          topicId : data.topicId,
          questionId : data.questionId,
          subCategory: data.subCategory,
          question: question,
          answerId: obj.answerId,
          number: obj.number
        });
      });
    });

    let answers = await this.query.findAnswer({status: 'active'});
    const resultAnswer = answers.data.map( r => {
      let description = (lang === 'en')? r.descriptionLangEn:r.descriptionLangId;
      return { answerId: r.answerId, keywords: r.keywords, description: description};
    });

    const merge = arraysResult.map( a => {
      let c = resultAnswer.find( b => b.answerId === a.answerId);
      return {
        topicId : a.topicId,
        questionId : a.questionId,
        keywords: c.keywords,
        subCategory: a.subCategory,
        question: a.question,
        answerId: c.answerId,
        description: c.description,
        number: a.number
      };
    });
    return wrapper.data( merge );
  }

  async getQuestionBySubCategoryInformation(lang) {
    const ctx = 'domain-getQuestionBySubCategoryInformation';
    const faq = await this.query.find({subCategory: 'Information', status: 'active'});
    if (faq.err) {
      logger.error(ctx, 'error', 'FAQ answer not found', faq.err);
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }

    const questionResult = faq.data.map(data => {
      let question = (lang === 'en')? data.titleLangEn:data.titleLangId;
      return {
        questionId : data.questionId,
        subCategory: data.subCategory,
        question: question,
      };
    });
    return wrapper.data( questionResult );
  }

  async getTroubleshooting(payload, lang) {
    const ctx = 'domain-getTroubleshooting';
    const {questionId, userId} = payload;
    const faq = await this.query.findQuestionOne({questionId});
    if (faq.err) {
      logger.error(ctx, 'error', 'FAQ question not found', faq.err);
      return wrapper.error(new NotFoundError('FAQ question not found'));
    }
    const topic = await this.query.findTopic({topicId:faq.data.topicId});
    if (topic.err) {
      logger.error(ctx, 'error', 'Data topic not found', topic.err);
      return wrapper.error(new NotFoundError('Data topic not found'));
    }

    const accountLinked = await this.query.findManyAccount({users: {$elemMatch: {userId: userId, isDeleted: false}}});
    if (accountLinked.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', accountLinked.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const user = await this.queryUser.findOneUser({userId: userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }
    let indihomeNumber,ncli,telephoneNumber,sto,address;
    for (const account of accountLinked.data) {
      const user = account.users.find(({userId}) => userId === payload.userId);
      if (user && user.status === 'active') {
        indihomeNumber = account.indihomeNumber;
        ncli = account.ncli;
        telephoneNumber = account.phoneNumber;
        sto = account.sto;
        address = account.address;
      }
    }
    const indiHomeAccount ={
      indihomeNumber: indihomeNumber,
      ncli: ncli,
      telephoneNumber: telephoneNumber,
      sto: sto,
      address: address
    };

    const checkGamasIsolir = await this.checkGamasIssue(indiHomeAccount,lang);
    if (!validate.isEmpty(checkGamasIsolir.data)){
      const resultGamasIsolir = {
        data: checkGamasIsolir.data,
        message: 'issue with Gamas / Isolir / Billing admin'
      };
      return wrapper.error(new ServiceUnavailableError(resultGamasIsolir));
    }

    const faqName = (lang === 'en')? faq.data.titleLangEn : faq.data.titleLangId;
    await this.query.createIndex();
    let listAssurance;
    const assurance = await this.query.findAssuranceSort({ $text: { $search: faqName } });
    if (assurance.err){
      const assuranceByType = await this.query.findAssurance({type:topic.data.categoryEn});
      listAssurance = assuranceByType.data;
    }else{
      listAssurance = assurance.data;
    }
    const fuzzy =  new FuzzySet();
    const arrAssurance = listAssurance.map(item => {
      fuzzy.add(`${item.symptomId} |${(lang === 'en')? item.descriptionEn : item.descriptionId}`);
      return ({
        'symptomId': item.symptomId,
        'category': item.type,
        'issueType': status.issueType(item.type),
        'issues': (lang === 'en')? item.descriptionEn : item.descriptionId,
        'technicalLanguage': item.technicalLanguage
      });
    });
    const options = {
      includeScore: true,
      keys: [
        {
          name: 'issues',
          weight: 0.8
        },
        {
          name: 'technicalLanguage',
          weight: 0.2
        }
      ]
    };
    const fuse = new Fuse(arrAssurance, options);
    const resultFuse = fuse.search(faqName);
    const fixScore = resultFuse.map(items => {
      return ({
        symptomId: items.item.symptomId,
        item: items.item,
        score: Number(items.score).toPrecision(2)
      });
    });
    const mostMatch = fuzzy.get(faqName);
    let resultsArray = [];
    let sortResult = fixScore.sort((a,b) =>parseFloat(b.score) - parseFloat(a.score));
    if (!validate.isEmpty(mostMatch)){
      const mostMatchSymptom = arrAssurance.find(o => o.symptomId === mostMatch[0][1].split(' |')[0]);
      resultsArray.push(mostMatchSymptom);
      sortResult.map(items => {
        if (items.symptomId !== mostMatch[0][1].split(' |')[0]) {
          resultsArray.push(items.item);
        }
      });
    }else{
      sortResult.map(items => {
        resultsArray.push(items.item);
      });
    }
    return wrapper.data(resultsArray);
  }

  async checkGamasIssue(indihomeAccount,language) {
    const ctx = 'domain-checkGamasIssue';
    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const assetNum = `${indihomeAccount.ncli - 0}_${indihomeAccount.indihomeNumber}_INTERNET`;

    const checkGamasData = await service.checkGamas({
      jwt:dataJwt.data,
      body: {
        EXTTransactionID: moment().format('DDMMYYYY'),
        SID: [assetNum]
      }
    });
    if(checkGamasData.err) {
      return wrapper.error(new BadRequestError({
        message: checkGamasData.err.message,
        code: 1004
      }));
    }

    if (checkGamasData.statusCode === '0'){
      const messageGamas = await status.gamasStatus(language, checkGamasData.data[0].gamas.statusDate);
      return wrapper.data(messageGamas);
    }

    const newCheckIsolirBody = Model.checkIsolirBody();
    newCheckIsolirBody.checkND.I_MSISDN = indihomeAccount.indihomeNumber;

    const newCheckInquiryBody = Model.checkInquiryBody();
    newCheckInquiryBody.indihome_number = indihomeAccount.indihomeNumber;

    const checkIsolirData = await service.checkIsolir({
      jwt:dataJwt.data,
      body: newCheckIsolirBody
    });
    if(checkIsolirData.err) {
      return wrapper.error(new BadRequestError({
        message: checkIsolirData.err.message,
        code: 1004
      }));
    }

    const newResultResponse = Model.responseResult();
    if(checkIsolirData.checkNDResponse.OutCheckND.O_STATUS_CODE === 'F-1') {
      const messageIsolir = Model.messageIsolir();
      newResultResponse.title = messageIsolir.titleID;
      newResultResponse.description = messageIsolir.descriptionID;
      if(language === 'en'){
        newResultResponse.title = messageIsolir.titleEN;
        newResultResponse.description = messageIsolir.descriptionEN;
      }
      newResultResponse.status = 'ISOLIR';
      delete newResultResponse.amount;
      return wrapper.data({
        indihomeNum: indihomeAccount.indihomeNumber,
        status: newResultResponse.status,
        title: newResultResponse.title,
        description: newResultResponse.description
      });
    }

    const checkInquiryData = await service.checkInquiry({
      jwt:dataJwt.data,
      body: newCheckInquiryBody
    });
    if(checkInquiryData.err) {
      return wrapper.error(new BadRequestError({
        message: checkInquiryData.err.message,
        code: 1005
      }));
    }

    if(checkInquiryData.statusCode !== '-2' && !validate.isEmpty(checkInquiryData.data) && !validate.isEmpty(checkInquiryData.data.amount)) {
      newResultResponse.status = 'OUTSTANDING';
      newResultResponse.amount = checkInquiryData.data.amount;
      const messageOutstanding = Model.messageOutstanding();
      newResultResponse.title = messageOutstanding.titleID;
      newResultResponse.description = messageOutstanding.descriptionID;
      if(language === 'en'){
        newResultResponse.title = messageOutstanding.titleEN;
        newResultResponse.description = messageOutstanding.descriptionEN;
      }
      return wrapper.data({
        indihomeNum: indihomeAccount.indihomeNumber,
        status: newResultResponse.status,
        amount: newResultResponse.amount,
        title: newResultResponse.title,
        description: newResultResponse.description
      });
    }

    return wrapper.error(new BadRequestError({
      message: 'CANNOT CHECK OUTSTANDING AND ISOLIR INDIHOME NUMBER',
      code: 1006
    }));

  }
}

module.exports = Faq;
