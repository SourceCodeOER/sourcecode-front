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
      const status = error.response.status;

      console.log(app.router);

      if ([401, 403].includes(status) && app.router && app.router.currentRoute.path !== '/login') {
        // @ts-ignore
        if($auth.loggedIn || $auth.strategies.local.options.endpoints.user.headers['Authorization'] !== null) {
          await $auth.logout();
          // @ts-ignore
          $auth.strategies.local.options.endpoints.user.headers['Authorization'] = null;
          $auth.setToken('local', undefined)
        }

        redirect(status, "/login");
      } else {
        return Promise.reject(error);
      }
    });

};

export default axios
