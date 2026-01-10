const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

const logDir = path.join(__dirname, 'logs');
fs.ensureDirSync(logDir);

const logFile = path.join(logDir, `log_${moment().format('YYYYMMDD')}.log`);

const log = (level, message) => {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage, { encoding: 'utf8' });
  
  // ترجمة مستويات السجل
  const levelTranslations = {
    'info': 'معلومات',
    'error': 'خطأ',
    'warn': 'تحذير',
    'success': 'نجاح'
  };
  
  const arabicLevel = levelTranslations[level] || level.toUpperCase();
  const arabicLogMessage = `[${timestamp}] [${arabicLevel}] ${message}\n`;
  
  switch (level) {
    case 'info':
      console.log(arabicLogMessage);
      break;
    case 'error':
      console.error(arabicLogMessage);
      break;
    case 'warn':
      console.warn(arabicLogMessage);
      break;
    case 'success':
      console.log(arabicLogMessage);
      break;
    default:
      console.log(arabicLogMessage);
  }
};

module.exports = { log };
