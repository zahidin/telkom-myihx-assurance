const Query = require('../queries/query');
const Command = require('./command');
const model = require('./command_model');
const logger = require('../../../../helpers/utils/logger');
const { InternalServerError, BadRequestError, ConflictError, NotFoundError } = require('../../../../helpers/error');
const uuidv4 = require('uuid/v4');
const minio = require('../../../../helpers/components/minio/sdk');
const fs = require('fs');
const wrapper = require('../../../../helpers/utils/wrapper');
const config = require('../../../../infra/configs/global_config');
const path = require('path');
const validate = require('validate.js');

class About {

  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
    this.path = path;
  }

  async postAbout(payload) {
    const ctx = 'domain-postAbout';
    let url = '';
    let socialMedia = [];
    let isErrorSocMedWebsite = false;
    let isErrorSocMedMobile = false;
    const fileType = ['.jpg','.jpeg','.png'];
    const payloadSocialMediaMobile= validate.isArray(payload.socialMediaMobile) ? payload.socialMediaMobile : [payload.socialMediaMobile];
    const payloadSocialMediaWebsite= validate.isArray(payload.socialMediaWebsite) ? payload.socialMediaWebsite : [payload.socialMediaWebsite];

    if (fileType.includes(this.path.extname(payload.iconWebsite.name)) === false
    || fileType.includes(this.path.extname(payload.iconMobile.name)) === false){
      logger.error(ctx, 'error', 'icon website/mobile must be [jpeg,jpg,png]', payload.iconWebsite.name);
      return wrapper.error(new BadRequestError('icon must be [jpeg,jpg,png]'));
    }


    payloadSocialMediaMobile.map((data) => {
      if (fileType.includes(this.path.extname(data.name)) === false){
        isErrorSocMedMobile = true;
      }
    });

    payloadSocialMediaWebsite.map((data) => {
      if (fileType.includes(this.path.extname(data.name)) === false){
        isErrorSocMedWebsite = true;
      }
    });

    if(isErrorSocMedWebsite || isErrorSocMedMobile){
      const msg = isErrorSocMedWebsite ? 'icon social media website must be [jpeg,jpg,png]' : 'icon social media mobile must be [jpeg,jpg,png]';
      logger.error(ctx, 'error', msg);
      return wrapper.error(new BadRequestError(msg));
    }

    if(payload.status === 'active'){
      const checkDataActive = await this.query.findOneAbout({status: 'active'});
      if(!checkDataActive.err){
        logger.error(ctx, 'error', 'About is already active');
        return wrapper.error(new ConflictError('About is already active'));
      }
    }

    url = JSON.parse(payload.url);

    const query = {'description.id': payload.descriptionId, 'description.en': payload.descriptionEn};
    const about = await this.query.findAbout(query);

    if(!about.err){
      logger.error(ctx, 'error', 'About already exist', about.err);
      return wrapper.error(new ConflictError('About already exist'));
    }

    const socialMediaTemp = url.map(async (d,i) => {
      socialMedia.push({
        website: await this.uploadImagesMinio({ image: payloadSocialMediaMobile[i], bucket: 'about', directory: 'website/icon' }),
        mobile: await this.uploadImagesMinio({ image: payloadSocialMediaWebsite[i], bucket: 'about', directory: 'mobile/icon' }),
        url: d,
        id: uuidv4(),
      });
    });

    await Promise.all(socialMediaTemp);
    const aboutModel = model.aboutModel();
    aboutModel.aboutId = uuidv4();
    aboutModel.socialMedia = socialMedia;
    aboutModel.description = {
      id: payload.descriptionId,
      en: payload.descriptionEn
    };
    aboutModel.icon = {
      website: await this.uploadImagesMinio({ image: payload.iconWebsite, bucket: 'about', directory: 'website/logo' }),
      mobile: await this.uploadImagesMinio({ image: payload.iconMobile, bucket: 'about', directory: 'mobile/logo' }),
    };
    aboutModel.creatorId = payload.creatorId;
    aboutModel.creatorName = payload.creatorName;
    aboutModel.publish = payload.publish;
    aboutModel.status = payload.status;

    const result = await this.command.insertAbout(aboutModel);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    return wrapper.data(result.data);
  }

  async updateAbout(id, payload){
    const ctx = 'domain-updateAbout';
    const url = payload.url && JSON.parse(payload.url) || false;
    let socialMedia = [];
    let imgSocMedWebsite = [];
    let imgSocMedMobile = [];
    let isErrorSocMedWebsite = false;
    let isErrorSocMedMobile = false;

    const payloadSocialMediaMobile= validate.isArray(payload.socialMediaMobile) ? payload.socialMediaMobile : [payload.socialMediaMobile];
    const payloadSocialMediaWebsite= validate.isArray(payload.socialMediaWebsite) ? payload.socialMediaWebsite : [payload.socialMediaWebsite];

    const about = await this.query.findOneAbout({aboutId: id});
    if(about.err){
      logger.error(ctx, 'error', 'About is already active');
      return wrapper.error(new NotFoundError('About not found'));
    }

    if(payload.url && !validate.isArray(url)){
      logger.error(ctx, 'error', 'Url must be an array');
      return wrapper.error(new BadRequestError('Url must be an array'));
    }

    if(payload.status === 'active'){
      const checkDataActive = await this.query.findOneAbout({aboutId:{$nin:[id]}, status: 'active'});
      if(!checkDataActive.err){
        logger.error(ctx, 'error', 'Another data is already active', about.err);
        return wrapper.error(new ConflictError('Another data is already active'));
      }
    }

    const fileType = ['.jpg','.jpeg','.png'];

    let iconWebsite = about.data.icon.website;
    let iconMobile = about.data.icon.mobile;

    if (!validate.isEmpty(payload.iconWebsite) && !validate.isEmpty(payload.iconMobile)) {

      if (validate.isEmpty(payload.iconWebsite.name) === false && validate.isEmpty(payload.iconMobile.name) === false){

        if (fileType.includes(this.path.extname(payload.iconWebsite.name)) === false
        || fileType.includes(this.path.extname(payload.iconMobile.name)) === false){
          logger.error(ctx, 'error', 'icon website/mobile must be [jpeg,jpg,png]', payload.iconWebsite.name);
          return wrapper.error(new BadRequestError('icon must be [jpeg,jpg,png]'));
        }

        const website = about.data.icon.website.split('/');
        const mobile = about.data.icon.mobile.split('/');

        iconWebsite = await this.uploadImagesMinio({image: payload.iconWebsite, bucket: 'about', directory:'website/logo'});
        if(iconWebsite !== 'about/default_picture.png'){
          await this.removeImagesMinio({bucket: 'about', directory:'website/logo', name: ('', website[3]) });
        }

        iconMobile = await this.uploadImagesMinio({image: payload.iconMobile, bucket: 'about', directory:'mobile/logo'});
        if(iconMobile !== 'about/default_picture.png'){
          await this.removeImagesMinio({bucket: 'about', directory:'mobile/logo', name: ('', mobile[3]) });
        }

        if(iconMobile === 'about/default_picture.png' || iconWebsite === 'about/default_picture.png'){
          logger.error(ctx, 'error', 'icon website/mobile failed to upload');
          return wrapper.error(new BadRequestError('icon website/mobile failed to upload'));
        }

      }
    }

    if(!validate.isEmpty(payload.socialMediaWebsite) || !validate.isEmpty(payload.socialMediaMobile)){

      if(!validate.isEmpty(payload.socialMediaWebsite)){
        payloadSocialMediaWebsite.map((d) => {
          if (d.type !== 'url' && fileType.includes(this.path.extname(d.name)) === false){
            isErrorSocMedWebsite = true;
          }

          if(d.type === 'url'){
            const checkUrl = validate({website: d.name}, {website: {url: true}});
            if(checkUrl){
              isErrorSocMedWebsite = true;
            }
          }
        });
      }

      if(!validate.isEmpty(payload.socialMediaMobile)){
        payloadSocialMediaMobile.map((d) => {
          if (d.type !== 'url' && fileType.includes(this.path.extname(d.name)) === false){
            isErrorSocMedMobile = true;
          }

          if(d.type === 'url'){
            const checkUrl = validate({website: d.name}, {website: {url: true}});
            if(checkUrl){
              isErrorSocMedMobile = true;
            }
          }
        });

      }

      if(isErrorSocMedWebsite || isErrorSocMedMobile){
        const msg = isErrorSocMedWebsite ? 'icon social media website must be [jpeg,jpg,png]' : 'icon social media mobile must be [jpeg,jpg,png]';
        logger.error(ctx, 'error', msg);
        return wrapper.error(new BadRequestError(msg));
      }

      for(const [index, data] of payloadSocialMediaWebsite.entries()){
        if(data.type === 'url'){
          imgSocMedWebsite.push(data.name.split(`${config.get('/minioBaseUrl')}/`)[1]);
        }

        if(data.type !== 'url'){
          const checkUpload = await this.uploadImagesMinio({image: data, bucket: 'about', directory: 'website/icon'});
          if(checkUpload){
            imgSocMedWebsite.push(checkUpload);
          }

          if(!validate.isEmpty(about.data.socialMedia[index].website) && checkUpload){
            const image = about.data.socialMedia[index].website.split('/');
            await this.removeImagesMinio({bucket: 'about', directory: 'website/icon', name: ('', image[3])});
          }
        }
      }

      for(const [index, data] of payloadSocialMediaMobile.entries()){
        if(data.type === 'url'){
          imgSocMedMobile.push(data.name.split(`${config.get('/minioBaseUrl')}/`)[1]);
        }

        if(data.type !== 'url'){
          const checkUpload = await this.uploadImagesMinio({image: data, bucket: 'about', directory: 'mobile/icon'});
          if(checkUpload){
            imgSocMedMobile.push(checkUpload);
          }

          if(!validate.isEmpty(about.data.socialMedia[index].mobile) && checkUpload){
            const image = about.data.socialMedia[index].mobile.split('/');
            await this.removeImagesMinio({bucket: 'about', directory: 'mobile/icon', name: ('', image[3])});
          }
        }
      }

      socialMedia = url.map((d, i) => ({
        website: imgSocMedWebsite[i],
        mobile: imgSocMedMobile[i],
        url: d.url,
      }));
    }

    const aboutModel = {
      $set: {
        description: {
          id: validate.isEmpty(payload.descriptionId) ? about.data.description.id : payload.descriptionId,
          en: validate.isEmpty(payload.descriptionEn) ? about.data.description.en : payload.descriptionEn
        },
        publish: validate.isEmpty(payload.publish) ? about.data.publish : payload.publish,
        status: validate.isEmpty(payload.status) ? about.data.status : payload.status,
        updatedId: payload.updatedId,
        socialMedia,
        updatedName:  payload.updatedName,
        icon: {
          website: iconWebsite,
          mobile: iconMobile
        },
        lastModified: new Date()
      }
    };

    const result = await this.command.upsertAbout({aboutId: id}, aboutModel);
    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    return result;
  }

  async removeAbout(payload){
    const ctx = 'domain-removeAbout';

    const about = await this.query.findOneAbout({aboutId: payload.id});
    if(about.err){
      logger.error(ctx, 'error', 'About not found', about.err);
      return wrapper.error(new NotFoundError('About not found'));
    }

    let countAbout = await this.query.countAbout();
    countAbout =  countAbout.data ? countAbout.data : 0;

    if(about.data.status === 'active' && countAbout === 1){
      logger.error(ctx, 'error', 'Main about can not be deleted');
      return wrapper.error(new BadRequestError('Main about can not be deleted'));
    }

    const iconWebsite = about.data.icon.website.split('/');
    const iconMobile = about.data.icon.mobile.split('/');

    const result = await this.command.removeAbout({aboutId: payload.id});

    if(result.err){
      logger.error(ctx, 'error', 'Internal server error', result.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    await this.removeImagesMinio({bucket: 'about', directory:'website/logo', name: ('', iconWebsite[3]) });
    await this.removeImagesMinio({bucket: 'about', directory:'mobile/logo', name: ('', iconMobile[3]) });

    about.data.socialMedia.map(async (d) => {
      const website = d.website.split('/');
      const mobile = d.mobile.split('/');
      await this.removeImagesMinio({bucket: 'about', directory: 'website/icon', name: ('', website[3]) });
      await this.removeImagesMinio({bucket: 'about', directory: 'mobile/icon', name: ('', mobile[3]) });
    });

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
}

module.exports = About;
