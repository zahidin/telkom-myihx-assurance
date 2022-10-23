const assert = require('assert');
const sinon = require('sinon');
const Query = require('../../../../../../bin/modules/about/repositories/queries/query');


describe('About - Query', () => {
  it('findAbout',async () => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': [
          {
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
        ]
      })
    };

    const query = new Query(db);
    const result = await query.findAbout();
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].aboutId, '248cbfac-1b48-40c7-8e72-b08c814c8b8e');
  });

  it('findOneAbout',async () => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data':{
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
      })
    };

    const query = new Query(db);
    const result = await query.findOneAbout();
    assert.notEqual(result.data, null);
    assert.equal(result.data.aboutId, '248cbfac-1b48-40c7-8e72-b08c814c8b8e');
  });

  it('findAllAbout',async () => {
    const db = {
      setCollection: sinon.stub(),
      findAllData: sinon.stub().resolves({
        'err': null,
        'data':{
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
      })
    };

    const query = new Query(db);
    const result = await query.findAllAbout();
    assert.notEqual(result.data, null);
    assert.equal(result.data.aboutId, '248cbfac-1b48-40c7-8e72-b08c814c8b8e');
  });

  it('countAbout',async () => {
    const db = {
      setCollection: sinon.stub(),
      countData: sinon.stub().resolves({
        'err': null,
        'data':1
      })
    };

    const query = new Query(db);
    const result = await query.countAbout();
    assert.notEqual(result.data, null);
    assert.equal(result.data, 1);
  });
});

