import qs from 'qs'
import {Plugin} from '@nuxt/types'

const axios: Plugin = ({$axios, redirect, $auth, route}) => {

  // Set array format to repeat
  $axios.onRequest(config => {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });

  // Disconnect user (if connected) when 401 error and redirect to login page
  $axios.interceptors.response.use(
    function (response) {
      return response
    },
    async (error) => {
      console.log(route.path);

      if (error.response.status === 401 && route.path !== '/login') {
        if($auth.loggedIn) {
          console.log('logged');
          await $auth.logout();
        }

        console.log('redirect');

        redirect(401, "/login");
      } else {
        console.log('return error');
        return Promise.reject(error);
      }
    });

};

export default axios
