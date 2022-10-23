const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError } = require('../../../../helpers/error');
const logger = require('../../../../helpers/utils/logger');
const config = require('../../../../infra/configs/global_config');

class About {

  constructor(db) {
    this.query = new Query(db);
  }

  async getAbout(language, payload){
    const ctx = 'domain-getAbout';
    let param = {};
    let returnData = {
      lists: {},
      filteredCount: 0,
      totalCount: 0,
    };

    let {row, page, description, lastUpdated, status} = payload;
    row = parseInt(row) || 0;
    if(row <= 0) row = 10;
    page = parseInt(page) || 0;
    if(page <= 0) page = 1;
    if(description) param = {'description.id': {'$regex': description, '$options': 'i'} };
    if(status) param.status = {$in: JSON.parse(status)};
    if(lastUpdated){
      const lastModifiedGte = new Date(lastUpdated + 'T00:00:00.000+07:00');
      const lastModifiedLte = new Date(lastUpdated + 'T23:59:59.000+07:00');
      param = {...param, $and:[
        {$expr: { $gte: [ '$lastModified', lastModifiedGte ] } },
        {$expr: { $lte: [ '$lastModified', lastModifiedLte ] } }]
      };
    }

    const about = await this.query.findAllAbout('lastModified', row, page, param);
    if (about.err) {
      logger.error(ctx, 'error', 'About no result', about.err);
      return wrapper.error(new NotFoundError('About no result'));
    }

    const resultAbout = about.data.reduce((r, {description,aboutId,lastModified,creatorName,status,icon,socialMedia}) => {
      const social = socialMedia.map((d) => ({
        website: `${config.get('/minioBaseUrl')}/${d.website}`,
        mobile: `${config.get('/minioBaseUrl')}/${d.mobile}`,
        url: d.url
      }));

      r.push({
        id: aboutId,
        creatorName: creatorName,
        description: description[language],
        icon:{
          website: `${config.get('/minioBaseUrl')}/${icon.website}`,
          mobile: `${config.get('/minioBaseUrl')}/${icon.mobile}`
        },
        lastUpdate: lastModified,
        socialMedia: social,
        status,
      });
      return r;
    },[]);

    returnData.lists = resultAbout;
    returnData.filteredCount = (((page-1) * row) + returnData.lists.length);
    let countTotal = await this.query.countAbout();
    returnData.totalCount = ( countTotal.data ? countTotal.data : 0);
    return wrapper.data(returnData);
  }

  async getAboutId(payload){
    const ctx = 'domain-getAboutId';
    const {id} = payload;

    const about = await this.query.findOneAbout({aboutId:id});
    if(about.err){
      logger.error(ctx, 'error', 'About no result', about.err);
      return wrapper.error(new NotFoundError('About no result'));
    }

    const {data} = about;

    const socialMedia = data.socialMedia.map((d) => ({
      website: `${config.get('/minioBaseUrl')}/${d.website}`,
      mobile: `${config.get('/minioBaseUrl')}/${d.mobile}`,
      url: d.url,
      id: d.id
    }));

    const result = {
      aboutId: data.aboutId,
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      description: data.description,
      icon:{
        website: `${config.get('/minioBaseUrl')}/${data.icon.website}`,
        mobile: `${config.get('/minioBaseUrl')}/${data.icon.mobile}`
      },
      publishDate: data.publish,
      lastUpdate: data.lastModified,
      socialMedia: socialMedia,
      status: data.status,
    };
    return wrapper.data(result);
  }

  async about(language){
    const ctx = 'domain-about';

    const about = await this.query.findOneAbout({status:'active'});
    if(about.err){
      logger.error(ctx, 'error', 'About no result', about.err);
      return wrapper.error(new NotFoundError('About no result'));
    }

    const {data} = about;

    const socialMedia = data.socialMedia.map((d) => ({
      website: `${config.get('/minioBaseUrl')}/${d.website}`,
      mobile: `${config.get('/minioBaseUrl')}/${d.mobile}`,
      url: d.url
    }));

    const result = {
      logo:{
        website: `${config.get('/minioBaseUrl')}/${data.icon.website}`,
        mobile: `${config.get('/minioBaseUrl')}/${data.icon.mobile}`
      },
      description: data.description[language],
      socialMedia: socialMedia,
    };
    return wrapper.data(result);
  }
}

module.exports = About;
