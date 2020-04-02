import qs from 'qs'
import {Plugin} from '@nuxt/types'

const axios: Plugin = ({$axios, redirect, $auth, app}) => {

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
      if (error.response.status === 401 && app.router && app.router.currentRoute.path !== '/login') {

        if($auth.loggedIn) {
          await $auth.logout();
        }

        redirect(401, "/login");
      } else {
        return Promise.reject(error);
      }
    });

};

export default axios
