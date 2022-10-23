const sinon = require('sinon');
const assert = require('assert');
const fs = require('fs');
const About = require('../../../../../../bin/modules/about/repositories/commands/domain');
const query = require('../../../../../../bin/modules/about/repositories/queries/query');
const command = require('../../../../../../bin/modules/about/repositories/commands/command');
const logger = require('../../../../../../bin/helpers/utils/logger');
const minio = require('../../../../../../bin/helpers/components/minio/sdk');


describe('Domain about', () => {
  beforeEach(async () => {
    sinon.stub(logger, 'log');
    sinon.stub(logger, 'info');
    sinon.stub(logger, 'error');
  });

  afterEach(async () => {
    logger.log.restore();
    logger.info.restore();
    logger.error.restore();
  });

  const db = {
    setCollection: sinon.stub()
  };

  const about = new About(db);


  const aboutOne = {
    'err': null,
    'data': {
      'aboutId' : '248cbfac-1b48-40c7-8e72-b08c814c8b8e',
      'description' : {
        'id' : 'bahasa indonesia',
        'en' : 'english language'
      },
      'icon' : {
        'website' : 'about/website/logo/16c7e1b3-ddc3-4cf4-b696-c8cca88809f0.jpg',
        'mobile' : 'about/mobile/logo/d2f24da3-9875-4e4c-907c-9913feb85e83.jpg'
      },
      'publish' : '2020-01-1',
      'status' : 'inactive',
      'creatorId' : '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'creatorName' : 'Super Administrator',
      'updatedId' : '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'updatedName' : 'Super Administrator',
      'createdAt' : '2021-02-01T09:56:09.403+07:00',
      'lastModified' : '2021-02-04T10:00:12.454+07:00',
      'socialMedia' : [
        {
          'website' : 'about/website/icon/6530d1c3-bedc-4cac-be18-536cfeafc851.jpg',
          'mobile' : 'about/mobile/icon/a212ea58-63dd-43c6-a069-1f784aec699c.jpg',
          'url' : 'https://facebook.com'
        },
        {
          'website' : 'about/website/icon/838fc616-bfc9-4493-8fd9-e5bd7437ad03.jpg',
          'mobile' : 'about/mobile/icon/a52ce7c4-ee51-454a-8f2d-c05eea409c2f.jpg',
          'url' : 'https://twitter.com'
        }
      ]
    }
  };

  let payloadError = {
    'descriptionId': 'Indonesia',
    'descriptionEn':'Inggris',
    'publish': '2021-11-17',
    'status': 'inactive',
    'url': JSON.stringify(['https://facebook.com']),
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'website.gif',
      'type': 'website/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Mobile.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'socialMediaWebsite': [
      {
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'Mobile.gif',
        'type': 'image/gif',
        'mtime': '2020-04-24T07:41:07.309Z'
      },
    ],
    'socialMediaMobile': [
      {
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'Mobile.gif',
        'type': 'image/gif',
        'mtime': '2020-04-24T07:41:07.309Z'
      },
    ]
  };

  let icon = {
    'image': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'type': 'selfi'
  };

  let payload = {
    'descriptionId': 'Indonesia',
    'descriptionEn':'Inggris',
    'publish': '2021-11-17',
    'status': 'inactive',
    'url': JSON.stringify(['https://facebook.com']),
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'website.png',
      'type': 'website/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Mobile.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'socialMediaWebsite': [
      {
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'Mobile.png',
        'type': 'image/png',
        'mtime': '2020-04-24T07:41:07.309Z'
      },
    ],
    'socialMediaMobile': [
      {
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'Mobile.png',
        'type': 'image/png',
        'mtime': '2020-04-24T07:41:07.309Z'
      },
    ]
  };

  describe('Post About', () => {
    it('should return error file extension', async() => {
      let customPayload = {};
      customPayload = payloadError;
      const result1 = await about.postAbout(payloadError);
      assert.equal(result1.err.message, 'icon must be [jpeg,jpg,png]');

      customPayload = {
        ...payloadError,
        'iconWebsite': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'website.png',
          'type': 'website/png',
          'mtime': '2020-04-24T07:41:07.309Z'
        },
        'iconMobile': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'Mobile.png',
          'type': 'image/png',
          'mtime': '2020-04-24T07:41:07.309Z'
        },};
      const result2 = await about.postAbout(customPayload);
      assert.equal(result2.err.message, 'icon social media website must be [jpeg,jpg,png]');

      customPayload = {
        ...payloadError,
        'socialMediaWebsite': [
          {
            'size': 49805,
            'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
            'name': 'Mobile.png',
            'type': 'image/png',
            'mtime': '2020-04-24T07:41:07.309Z'
          },
        ],
        'iconWebsite': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'website.png',
          'type': 'website/png',
          'mtime': '2020-04-24T07:41:07.309Z'
        },
        'iconMobile': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'Mobile.png',
          'type': 'image/png',
          'mtime': '2020-04-24T07:41:07.309Z'
        },};
      const result3 = await about.postAbout(customPayload);
      assert.equal(result3.err.message, 'icon social media mobile must be [jpeg,jpg,png]');
    });

    it('should return error about already exist', async() => {
      sinon.stub(query.prototype, 'findAbout').resolves({err: null});
      const result = await about.postAbout(payload);
      query.prototype.findAbout.restore();
      assert.equal(result.err.message, 'About already exist');
    });

    it('should return error internal server error', async () =>{
      sinon.stub(query.prototype, 'findAbout').resolves({err: true, data:[]});
      sinon.stub(command.prototype, 'insertAbout').resolves({err: true});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');

      const result = await about.postAbout(payload);
      query.prototype.findAbout.restore();
      command.prototype.insertAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err.message, 'Internal server error');
    });

    it('should return error about already active', async () =>{
      sinon.stub(query.prototype, 'findAbout').resolves({err: true, data:[]});
      sinon.stub(query.prototype, 'findOneAbout').resolves({err: false, data:{success:true}});

      const result = await about.postAbout({...payload,socialMediaMobile:{
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'website.png',
        'type': 'website/png',
        'mtime': '2020-04-24T07:41:07.309Z'
      },socialMediaWebsite:{
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'mobile.png',
        'type': 'mobile/png',
        'mtime': '2020-04-24T07:41:07.309Z'
      },status:'active'});
      query.prototype.findAbout.restore();
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'About is already active');
    });

    it('should return success', async () =>{
      sinon.stub(query.prototype, 'findAbout').resolves({err: true, data:[]});
      sinon.stub(command.prototype, 'insertAbout').resolves({err: false,data:{status:'active'}});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');

      const result = await about.postAbout(payload);
      query.prototype.findAbout.restore();
      command.prototype.insertAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err, null);
    });
  });

  describe('updateAbout', () => {
    it('should return about not found', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:true});
      const result = await about.updateAbout('123123', payload);
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'About not found');
    });

    it('should return error icon image validation', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false, data:aboutOne.data});
      const result = await about.updateAbout('id',payloadError);
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'icon must be [jpeg,jpg,png]');
    });

    it('should return error social media website image validation', async () => {
      const customPayload = {
        ...payload,
        'socialMediaWebsite': [
          {
            'size': 49805,
            'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
            'name': 'Mobile.gif',
            'type': 'image/gif',
            'mtime': '2020-04-24T07:41:07.309Z'
          },
        ],
        'socialMediaMobile': [
          {
            'size': 49805,
            'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
            'name': 'Mobile.gif',
            'type': 'image/gif',
            'mtime': '2020-04-24T07:41:07.309Z'
          },
        ]};
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false, data:aboutOne.data});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
      const result = await about.updateAbout('id',customPayload);
      query.prototype.findOneAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err.message, 'icon social media website must be [jpeg,jpg,png]');
    });

    it('should return error social media mobile image validation', async () => {
      const customPayload = {
        ...payload,
        'socialMediaWebsite': [
          {
            'size': 49805,
            'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
            'name': 'Mobile.jpg',
            'type': 'image/jpg',
            'mtime': '2020-04-24T07:41:07.309Z'
          },
        ],
        'socialMediaMobile': [
          {
            'size': 49805,
            'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
            'name': 'Mobile.gif',
            'type': 'image/gif',
            'mtime': '2020-04-24T07:41:07.309Z'
          },
        ]};
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false, data:aboutOne.data});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
      const result = await about.updateAbout('id',customPayload);
      query.prototype.findOneAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err.message, 'icon social media mobile must be [jpeg,jpg,png]');
    });

    it('should return error internal server error', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false, data:aboutOne.data});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(command.prototype, 'upsertAbout').resolves({err:true});
      const result = await about.updateAbout('id',payload);
      query.prototype.findOneAbout.restore();
      command.prototype.upsertAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err.message, 'Internal server error');
    });

    it('should return error about already active', async () => {
      const queryFindOneAbout = sinon.stub(query.prototype, 'findOneAbout');
      queryFindOneAbout.onCall(0).resolves({err:false, data:aboutOne.data});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
      queryFindOneAbout.onCall(1).resolves({err:false,data:{succes:true}});
      const result = await about.updateAbout('id',{...payload, status:'active',socialMediaMobile:{
        'size': 49805,
        'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
        'name': 'Mobile.jpg',
        'type': 'image/jpg',
        'mtime': '2020-04-24T07:41:07.309Z'
      }});
      query.prototype.findOneAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err.message, 'Another data is already active');
    });

    it('should return error internal server error', async () => {
      const customPayload = {
        ...payload,
        descriptionId:'',
        descriptionEn:'',
        publish:'',
        status:'',
        socialMediaWebsite:'',
        socialMediaMobile:'',
      };
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false, data:aboutOne.data});
      sinon.stub(command.prototype, 'upsertAbout').resolves({err:false});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      sinon.stub(About.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
      const result = await about.updateAbout('id',customPayload);
      query.prototype.findOneAbout.restore();
      command.prototype.upsertAbout.restore();
      About.prototype.removeImagesMinio.restore();
      About.prototype.uploadImagesMinio.restore();
      assert.equal(result.err, false);
    });
  });

  describe('removeAbout', () => {
    it('should return about not found', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:true});
      const result = await about.removeAbout(payload);
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'About not found');
    });

    it('should return Main about can not be deleted', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false,data:{...aboutOne.data, status:'active'}});
      sinon.stub(query.prototype, 'countAbout').resolves({data:1});
      const result = await about.removeAbout(payload);
      query.prototype.findOneAbout.restore();
      query.prototype.countAbout.restore();
      assert.equal(result.err.message, 'Main about can not be deleted');
    });

    it('should return internal server error', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false,data:{...aboutOne.data, status:'active'}});
      sinon.stub(query.prototype, 'countAbout').resolves({data:12});
      sinon.stub(command.prototype, 'removeAbout').resolves({err:true});
      const result = await about.removeAbout(payload);
      query.prototype.findOneAbout.restore();
      query.prototype.countAbout.restore();
      command.prototype.removeAbout.restore();
      assert.equal(result.err.message, 'Internal server error');
    });

    it('should return success', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false,data:{...aboutOne.data, status:'active'}});
      sinon.stub(query.prototype, 'countAbout').resolves({data:12});
      sinon.stub(command.prototype, 'removeAbout').resolves({err:false,data:{success:true}});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      const result = await about.removeAbout(payload);
      query.prototype.findOneAbout.restore();
      query.prototype.countAbout.restore();
      command.prototype.removeAbout.restore();
      About.prototype.removeImagesMinio.restore();
      assert.equal(result.err, false);
    });

    it('should return success with coundata error', async () => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err:false,data:{...aboutOne.data, status:'active'}});
      sinon.stub(query.prototype, 'countAbout').resolves({err:true});
      sinon.stub(command.prototype, 'removeAbout').resolves({err:false,data:{success:true}});
      sinon.stub(About.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
      const result = await about.removeAbout(payload);
      query.prototype.findOneAbout.restore();
      query.prototype.countAbout.restore();
      command.prototype.removeAbout.restore();
      About.prototype.removeImagesMinio.restore();
      assert.equal(result.err, false);
    });

  });

  describe('Upload Images Minio', () => {
    it('should success upload', async () => {
      sinon.stub(minio, 'objectUpload').resolves({err: null});
      sinon.stub(fs, 'unlinkSync').resolves();
      const result = await about.uploadImagesMinio(icon);
      minio.objectUpload.restore();
      fs.unlinkSync.restore();
      assert.notEqual(result, null);
    });
    it('should fail upload', async () => {
      sinon.stub(minio, 'objectUpload').resolves({err: true});
      const result = await about.uploadImagesMinio(icon);
      minio.objectUpload.restore();
      assert.notEqual(result, null);
    });
  });

  describe('Remove Images Minio', () => {
    it('should success remove', async () => {
      sinon.stub(minio, 'objectRemove').resolves({err: null});
      const result = await about.removeImagesMinio(icon);
      minio.objectRemove.restore();
      assert.notEqual(result, null);
    });
    it('should fail remove', async () => {
      sinon.stub(minio, 'objectRemove').resolves({err: true});
      const result = await about.removeImagesMinio(icon);
      minio.objectRemove.restore();
      assert.notEqual(result, null);
    });
  });

});
