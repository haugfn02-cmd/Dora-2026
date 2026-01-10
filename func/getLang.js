const fs = require('fs-extra');
const path = require('path');

let languageData = {};

/**
 * تحميل ملف اللغة
 */
const loadLanguage = (lang = 'ar') => {
  try {
    const langPath = path.join(__dirname, `../config/language/${lang}.json`);
    if (fs.existsSync(langPath)) {
      languageData = fs.readJsonSync(langPath);
      console.log(`✅ تم تحميل ملف اللغة: ${lang}.json`);
      return true;
    } else {
      console.error(`❌ ملف اللغة غير موجود: ${lang}.json`);
      return false;
    }
  } catch (error) {
    console.error(`❌ خطأ في تحميل ملف اللغة: ${error.message}`);
    return false;
  }
};

/**
 * الحصول على نص مترجم
 * @param {string} key - مفتاح النص (مثال: "commands.notFound")
 * @param {object} vars - متغيرات للاستبدال (مثال: {name: "محمد"})
 * @returns {string}
 */
const getLang = (key, vars = {}) => {
  try {
    const keys = key.split('.');
    let value = languageData;
    
    for (const k of keys) {
      if (value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string') {
      Object.keys(vars).forEach(varKey => {
        value = value.replace(new RegExp(`{${varKey}}`, 'g'), vars[varKey]);
      });
    }

    return value;
  } catch (error) {
    return key;
  }
};

// تحميل اللغة عند بدء التشغيل
loadLanguage('ar');

module.exports = {
  getLang,
  loadLanguage
};
