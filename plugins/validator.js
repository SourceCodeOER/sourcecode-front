import {localize} from 'vee-validate';
import fr from 'vee-validate/dist/locale/fr.json'
//import validator from 'validator';

import {extend} from 'vee-validate';
import {required, email, alpha_spaces, max, min, numeric, regex, mimes, oneOf} from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('alpha_spaces', alpha_spaces);
extend('max', max);
extend('min', min);
extend('numeric', numeric);
extend('regex', regex);
extend('mimes', mimes);
extend('oneOf', oneOf);

/*
const urlValidation = {
  validate(value) {
    if (validator.isURL(value)) {
      return true;
    }

    return `Cette URL n'est pas valide`
  }
};

extend('url', urlValidation);
 */

export default function ({app}) {
  localize('fr', fr);
}
