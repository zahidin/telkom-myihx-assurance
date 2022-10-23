const moment = require('moment');

const gamasStatus = async (lang,date=moment().hour(24).format('DD/MM/YYYY')) => {
  const dateEst = moment(date).format('DD/MM/YYYY H:m:s');
  switch (lang) {
  case 'id':
    return {
      type: 'GAMAS',
      title: 'Saat ini daerah Anda sedang mengalami gangguan massal',
      description: 'Hal ini sedang dalam penanganan teknisi kami',
      message: `Hal ini menyebabkan koneksi Anda menjadi lambat dan sedang dalam penanganan tim teknis kami dengan estimasi dengan ${dateEst} . `+
        'Mohon maaf atas ketidaknyamannya'
    };
  default:
    return {
      type: 'GAMAS',
      title: 'Saat ini daerah Anda sedang mengalami gangguan massal',
      description: 'Hal ini sedang dalam penanganan teknisi kami',
      message: `This is causing your connection to be slow and our technical team is handling the estimate with ${dateEst}.`+
        'Sorry for the inconvenience'
    };
  }
};

const issueType = (type) => {
  let issueType = '';
  switch (type.toUpperCase()) {
  case 'TV':
    issueType = 'IPTV';
    break;
  case 'TELEPHONE':
    issueType = 'VOICE';
    break;
  default:
    issueType = 'INTERNET';
    break;
  }
  return issueType;
};

module.exports = {
  gamasStatus,
  issueType
};
