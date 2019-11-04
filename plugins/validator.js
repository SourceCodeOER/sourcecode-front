import {localize} from 'vee-validate';

import {extend} from 'vee-validate';
import {required, email, alpha_spaces, max, numeric} from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('alpha_spaces', alpha_spaces);
extend('max', max);
extend('numeric', numeric);

function loadLocale(code) {
  return import(`vee-validate/dist/locale/${code}.json`).then(locale => {
    localize(code, locale);
  });
}

export default function ({app}) {
  loadLocale(app.i18n.locale);

  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    if (oldLocale !== newLocale) {
      loadLocale(newLocale);
    }
  }
}
