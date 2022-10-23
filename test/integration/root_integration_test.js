const hippie = require('hippie');
process.env.MONGO_DATABASE_URL='mongodb://localhost:27017/domain';
process.env.PORT=9000;
process.env.BASIC_AUTH_USERNAME='telkom';
process.env.BASIC_AUTH_PASSWORD='da1c25d8-37c8-41b1-afe2-42dd4825bfea';
process.env.PUBLIC_KEY_PATH='public.pem';
process.env.PRIVATE_KEY_PATH='private.pem';
process.env.MINIO_ACCESS_KEY='J08qkxKSfrPNMynwAb3U';
process.env.MINIO_SECRET_KEY='Igq0L7SU5jPP1M83MO7cJMqw0LI1R3SI1hp0wBG5';
process.env.MINIO_END_POINT='minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id';
process.env.CMS_OAUTH_URL='http://revoluzio-ms-account-dev.vsan-apps.playcourt.id';
const AppServer = require('../../bin/app/server');

describe('Root', () => {
  let appServer;

  beforeEach(function () {
    appServer = new AppServer();
    this.server = appServer.server;
  });

  afterEach(function () {
    delete process.env.MONGO_DATABASE_URL;
    delete process.env.PORT;
    delete process.env.BASIC_AUTH_USERNAME;
    delete process.env.BASIC_AUTH_PASSWORD;
    delete process.env.PUBLIC_KEY_PATH;
    delete process.env.PRIVATE_KEY_PATH;
    delete process.env.MINIO_ACCESS_KEY;
    delete process.env.MINIO_SECRET_KEY;
    delete process.env.MINIO_END_POINT;
    delete process.env.CMS_OAUTH_URL;
    this.server.close();
  });

  it('Should access root service', function (done) {

    hippie(this.server)
      .get('/')
      .expectStatus(200)
      .end((err, res, body) => {
        if(err){
          throw err;
        }
        done();
      });
  });
});
