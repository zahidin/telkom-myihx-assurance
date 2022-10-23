const apm = require('../helpers/components/apm/apm');
apm.init();
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const project = require('../../package.json');
const basicAuth = require('../auth/basic_auth_helper');
const jwtAuth = require('../auth/jwt_auth_helper');
const jwtAuthCms = require('../auth/cms/jwt_auth_helper');
const wrapper = require('../helpers/utils/wrapper');
const userHandler = require('../modules/user/handlers/api_handler');
const issueHandler = require('../modules/issues/handlers/api_handler');
const modemHandler = require('../modules/modem/handlers/api_handler');
const faqHandler = require('../modules/faq/handlers/api_handlers');
const aboutHandler = require('../modules/about/handlers/api_handlers');
const mongoConnectionPooling = require('../helpers/databases/mongodb/connection');
const minio = require('../helpers/components/minio/sdk');

function AppServer() {
  this.server = restify.createServer({
    name: `${project.name}-server`,
    version: project.version
  });

  this.server.serverKey = '';
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser({ multiples:true }));
  this.server.use(restify.plugins.authorizationParser());

  // required for CORS configuration
  const corsConfig = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    // ['*'] -> to expose all header, any type header will be allow to access
    // X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
  });
  this.server.pre(corsConfig.preflight);
  this.server.use(corsConfig.actual);

  // // required for basic auth
  this.server.use(basicAuth.init());

  // anonymous can access the end point, place code bellow
  this.server.get('/', (req, res) => {
    wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
  });

  // authenticated client can access the end point, place code bellow
  this.server.post('/users/v1/login', basicAuth.isAuthenticated, userHandler.postDataLogin);
  this.server.get('/users/v1/profile', jwtAuth.verifyToken, userHandler.getUser);
  this.server.post('/users/v1/register', basicAuth.isAuthenticated, userHandler.registerUser);

  this.server.get('/assurance/v1/categories', jwtAuth.verifyToken, issueHandler.getAllCategories);
  this.server.get('/assurance/v1/categories/:type', jwtAuth.verifyToken, issueHandler.getIssuesByType);
  this.server.get('/assurance/v1/categories/issue/:issueId', jwtAuth.verifyToken, issueHandler.getIssuesById);
  this.server.post('/assurance/v1/ticket', jwtAuth.verifyToken, issueHandler.createTicket);
  this.server.post('/assurance/v1/schedule', jwtAuth.verifyToken, issueHandler.postSchedule);
  this.server.post('/assurance/v1/schedule/reopen', jwtAuth.verifyToken, issueHandler.postReopenSchedule);
  this.server.get('/assurance/v1/ticket/:issueId', jwtAuth.verifyToken, issueHandler.getTicketDetails);
  this.server.get('/assurance/v1/ticket/reschedule/:issueId', jwtAuth.verifyToken, issueHandler.getRescheduleTicket);
  this.server.post('/assurance/v1/ticket/reschedule/:issueId', jwtAuth.verifyToken, issueHandler.rescheduleTicket);
  this.server.post('/assurance/v1/ticket/reopen', jwtAuth.verifyToken, issueHandler.reopenTicket);
  this.server.post('/assurance/v1/ticket/close', jwtAuth.verifyToken, issueHandler.closeTicket);
  this.server.get('/assurance/v1/schedule/technician', jwtAuth.verifyToken, issueHandler.scheduleAvailability);
  this.server.get('/assurance/v1/reopen/technician', jwtAuth.verifyToken, issueHandler.reopenTechnician);

  //callback
  this.server.put('/assurance/v1/ticket/technician', basicAuth.isAuthenticated, issueHandler.updateTicketId);
  this.server.put('/assurance/v1/ticket/status', basicAuth.isAuthenticated, issueHandler.updateStatusTicket);

  //modem
  this.server.get('/assurance/v1/modem/reset', jwtAuth.verifyToken, modemHandler.resetModem);

  //additional comment
  this.server.get('/assurance/v1/comments/:issueId', jwtAuth.verifyToken, issueHandler.comment);
  this.server.post('/assurance/v1/comments', jwtAuth.verifyToken, issueHandler.addComment);

  //faq
  this.server.get('/assurance/v1/faq', basicAuth.isAuthenticated, faqHandler.getFaq);

  //about
  this.server.get('/assurance/v1/about', basicAuth.isAuthenticated, aboutHandler.about);

  //faq Question
  this.server.get('/assurance/v1/cms/faq/question', jwtAuthCms.verifyToken, faqHandler.getQuestion);
  this.server.get('/assurance/v1/cms/faq/question/:id', jwtAuthCms.verifyToken, faqHandler.getQuestionDetail);
  this.server.post('/assurance/v1/cms/faq/question', jwtAuthCms.verifyToken, faqHandler.postQuestion);
  this.server.put('/assurance/v1/cms/faq/question/:id', jwtAuthCms.verifyToken, faqHandler.updateQuestion);
  this.server.del('/assurance/v1/cms/faq/question/:id', jwtAuthCms.verifyToken, faqHandler.removeQuestion);
  this.server.del('/assurance/v1/cms/faq/question/:questionId/answer/:answerId', jwtAuthCms.verifyToken, faqHandler.removeListAnswer);
  this.server.put('/assurance/v1/cms/faq/question/answers/list', jwtAuthCms.verifyToken, faqHandler.updatedListAnswer);
  this.server.get('/assurance/v1/cms/faq/question/category/information', jwtAuthCms.verifyToken, faqHandler.getQuestionBySubCategoryInformation);

  //faq Answer
  this.server.get('/assurance/v1/cms/faq/answer', jwtAuthCms.verifyToken, faqHandler.getAnswers);
  this.server.get('/assurance/v1/cms/faq/answer/:id', jwtAuthCms.verifyToken, faqHandler.getAnswerDetail);
  this.server.post('/assurance/v1/cms/faq/answer', jwtAuthCms.verifyToken, faqHandler.postAnswer);
  this.server.put('/assurance/v1/cms/faq/answer/:id', jwtAuthCms.verifyToken, faqHandler.updateAnswer);
  this.server.del('/assurance/v1/cms/faq/answer/:id', jwtAuthCms.verifyToken, faqHandler.removeAnswer);
  this.server.get('/assurance/v1/cms/faq/answer/search', jwtAuthCms.verifyToken, faqHandler.searchAnswer);

  this.server.get('/assurance/v1/cms/topic-faq', jwtAuthCms.verifyToken, faqHandler.getTopicFaq);
  this.server.get('/assurance/v1/cms/topic', jwtAuthCms.verifyToken, faqHandler.listTopicFaq);
  this.server.get('/assurance/v1/cms/topic/:id', jwtAuthCms.verifyToken, faqHandler.getTopicDetail);
  this.server.post('/assurance/v1/cms/topic', jwtAuthCms.verifyToken, faqHandler.postTopic);
  this.server.put('/assurance/v1/cms/topic/list', jwtAuthCms.verifyToken, faqHandler.updateTopicList);
  this.server.put('/assurance/v1/cms/topic/:topicId', jwtAuthCms.verifyToken, faqHandler.updateTopic);
  this.server.del('/assurance/v1/cms/topic/:topicId', jwtAuthCms.verifyToken, faqHandler.removeTopic);

  // cms about
  this.server.get('/assurance/v1/cms/about', jwtAuthCms.verifyToken,aboutHandler.getAbout);
  this.server.get('/assurance/v1/cms/about/:id', jwtAuthCms.verifyToken,aboutHandler.getAboutId);
  this.server.post('/assurance/v1/cms/about', jwtAuthCms.verifyToken,aboutHandler.postAbout);
  this.server.put('/assurance/v1/cms/about/:id', jwtAuthCms.verifyToken, aboutHandler.updateAbout);
  this.server.del('/assurance/v1/cms/about/:id', jwtAuthCms.verifyToken, aboutHandler.removeAbout);

  this.server.get('/assurance/v1/faq/question/:topicId', basicAuth.isAuthenticated, faqHandler.getFaqQuestion);
  this.server.get('/assurance/v1/faq/category/:questionId', basicAuth.isAuthenticated, faqHandler.getFaqQuestionDetail);
  this.server.get('/assurance/v1/faq/:topicId/:subcategory', basicAuth.isAuthenticated, faqHandler.getFaqSubCategory);
  this.server.get('/assurance/v1/faq/troubleshooting/:questionId', jwtAuth.verifyToken, faqHandler.getTroubleshooting);
  this.server.get('/assurance/v1/faq/search', basicAuth.isAuthenticated, faqHandler.searchFaq);

  //Initiation
  mongoConnectionPooling.init();
  minio.init();
}

module.exports = AppServer;
