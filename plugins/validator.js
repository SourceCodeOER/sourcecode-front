import {localize} from 'vee-validate';
import fr from 'vee-validate/dist/locale/fr.json'

import {extend} from 'vee-validate';
import {required, email, alpha_spaces, max, numeric} from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('alpha_spaces', alpha_spaces);
extend('max', max);
extend('numeric', numeric);


export default function ({app}) {
  localize('fr', fr);
}
