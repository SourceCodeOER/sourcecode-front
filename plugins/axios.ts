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
      const status = parseInt(error.response && error.response.status);
      const shouldRefresh = [401, 403].includes(code);
      if (shouldRefresh) {
         await $auth.logout();
      }
      if (shouldRefresh && app.router && app.router.currentRoute.path !== '/login') {
        redirect(status, "/login");
      } else {
        return Promise.reject(error);
      }
    });

};

export default axios
