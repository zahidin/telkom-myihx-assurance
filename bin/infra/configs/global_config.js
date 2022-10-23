require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  basicAuthApi: [
    {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
    }
  ],
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  },
  publicKey: process.env.PUBLIC_KEY_PATH,
  privateKey: process.env.PRIVATE_KEY_PATH,
  dsnSentryUrl: process.env.DSN_SENTRY_URL,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  mysqlConfig: {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },
  apm: {
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  },
  redisHost: process.env.REDIS_CLIENT_HOST,
  redisPort: process.env.REDIS_CLIENT_PORT,
  redisPassword: process.env.REDIS_CLIENT_PASSWORD,
  redisIndex: process.env.REDIS_INDEX,
  telkomBaseUrl: process.env.TELKOM_BASE_URL,
  telkomAuth: process.env.TELKOM_AUTHORIZATION,
  indihomeAppId: process.env.INDIHOME_APP_ID,
  minio: {
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    endPoint: process.env.MINIO_END_POINT,
    useSSL: false
  },
  minioBaseUrl:process.env.MINIO_BASE_URL,
  logstash: {
    host: process.env.LOGSTASH_BASE_URL,
    port: process.env.LOGSTASH_PORT,
    node_name: 'myihx-assurance',
    ssl_enable: false,
    max_connect_retries: -1
  },
  kafka: {
    kafkaHost: process.env.KAFKA_HOST_URL
  },
  cmsOauth: process.env.CMS_OAUTH_URL
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
